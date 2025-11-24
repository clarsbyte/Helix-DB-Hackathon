'use client';

import { useState, useEffect, useRef } from 'react';
import Vapi from '@vapi-ai/web';
import { useGraphControl } from '@/contexts/GraphControlContext';
import { mockGraphData } from '@/data/mockGraphData';

export function VoiceSidebar() {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<Array<{ role: string; text: string; time: string }>>([
    {
      role: 'assistant',
      text: `Welcome back! I've loaded your graph with 10 active courses. Ask me to navigate to any course, module, or assignment.`,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const { zoomToNode, searchNode, focusOnCourse, resetView } = useGraphControl();

  // Fake audio visualizer bars
  const bars = Array.from({ length: 14 }).map((_, i) => ({
    id: i,
    height: Math.random() * 100,
    delay: i * 0.05
  }));

  useEffect(() => {
    // Initialize Vapi
    const vapiInstance = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '');
    setVapi(vapiInstance);

    // Event listeners
    vapiInstance.on('call-start', () => {
      setIsCallActive(true);
      console.log('Call started');
    });

    vapiInstance.on('call-end', () => {
      setIsCallActive(false);
      setIsSpeaking(false);
      console.log('Call ended');
    });

    vapiInstance.on('speech-start', () => {
      setIsSpeaking(true);
      console.log('Assistant speaking');
    });

    vapiInstance.on('speech-end', () => {
      setIsSpeaking(false);
      console.log('Assistant finished speaking');
    });

    vapiInstance.on('message', (message: any) => {
      console.log('Vapi message:', message);

      // Handle transcripts
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        if (message.role === 'user') {
          setTranscript(prev => [...prev, { role: 'user', text: message.transcript, time }]);
        } else if (message.role === 'assistant') {
          setTranscript(prev => [...prev, { role: 'assistant', text: message.transcript, time }]);
        }
      }

      // Handle function calls
      if (message.type === 'function-call') {
        handleFunctionCall(message);
      }
    });

    vapiInstance.on('error', (error: any) => {
      console.error('Vapi error:', error);
    });

    return () => {
      vapiInstance.stop();
    };
  }, []);

  const handleFunctionCall = (message: any) => {
    const { functionCall } = message;
    console.log('Function call:', functionCall);

    try {
      switch (functionCall.name) {
        case 'zoomToNode':
          const nodeId = functionCall.parameters.nodeId;
          zoomToNode(nodeId);
          break;

        case 'searchNode':
          const query = functionCall.parameters.query;
          const node = searchNode(query);
          if (node) {
            zoomToNode(node.id);
            // Send result back to Vapi
            vapi?.send({
              type: 'function-call-result',
              functionCallId: message.functionCallId,
              result: { success: true, node: { id: node.id, name: node.name, type: node.type } }
            });
          } else {
            vapi?.send({
              type: 'function-call-result',
              functionCallId: message.functionCallId,
              result: { success: false, message: 'Node not found' }
            });
          }
          break;

        case 'focusOnCourse':
          const courseName = functionCall.parameters.courseName;
          focusOnCourse(courseName);
          vapi?.send({
            type: 'function-call-result',
            functionCallId: message.functionCallId,
            result: { success: true }
          });
          break;

        case 'resetView':
          resetView();
          vapi?.send({
            type: 'function-call-result',
            functionCallId: message.functionCallId,
            result: { success: true }
          });
          break;

        case 'getCourseInfo':
          const courseQuery = functionCall.parameters.courseName.toLowerCase();
          const course = mockGraphData.nodes.find(n =>
            n.type === 'course' && n.name.toLowerCase().includes(courseQuery)
          );
          if (course) {
            const modules = mockGraphData.nodes.filter(n =>
              n.type === 'module' && mockGraphData.links.some(l =>
                l.source === course.id && l.target === n.id
              )
            );
            vapi?.send({
              type: 'function-call-result',
              functionCallId: message.functionCallId,
              result: {
                success: true,
                course: course.name,
                moduleCount: modules.length,
                modules: modules.map(m => m.name)
              }
            });
          } else {
            vapi?.send({
              type: 'function-call-result',
              functionCallId: message.functionCallId,
              result: { success: false, message: 'Course not found' }
            });
          }
          break;

        default:
          console.warn('Unknown function:', functionCall.name);
      }
    } catch (error) {
      console.error('Error handling function call:', error);
    }
  };

  const startCall = async () => {
    if (!vapi) return;

    try {
      await vapi.start({
        model: {
          provider: 'openai',
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are a helpful voice assistant for N-Mapper, a graph visualization app for Canvas courses. You help users navigate their course graph by zooming to specific nodes, courses, modules, and assignments.

Available courses: ${mockGraphData.nodes.filter(n => n.type === 'course').map(n => n.name).join(', ')}

You have access to these functions to control the graph:
- zoomToNode(nodeId): Zoom to a specific node by ID
- searchNode(query): Search for a node by name
- focusOnCourse(courseName): Focus on a specific course
- resetView(): Reset the camera to the default view
- getCourseInfo(courseName): Get information about a course including its modules

Be conversational and helpful. When the user asks about a course or assignment, use the functions to navigate the graph for them.`
            }
          ],
          functions: [
            {
              name: 'zoomToNode',
              description: 'Zoom the camera to a specific node by its ID',
              parameters: {
                type: 'object',
                properties: {
                  nodeId: {
                    type: 'string',
                    description: 'The ID of the node to zoom to (e.g., "cse101", "m18_mod1")'
                  }
                },
                required: ['nodeId']
              }
            },
            {
              name: 'searchNode',
              description: 'Search for a node by name or partial match',
              parameters: {
                type: 'object',
                properties: {
                  query: {
                    type: 'string',
                    description: 'Search query (e.g., "CSE 101", "Linear Equations")'
                  }
                },
                required: ['query']
              }
            },
            {
              name: 'focusOnCourse',
              description: 'Focus the camera on a specific course',
              parameters: {
                type: 'object',
                properties: {
                  courseName: {
                    type: 'string',
                    description: 'The name of the course (e.g., "CSE 101", "MATH 18")'
                  }
                },
                required: ['courseName']
              }
            },
            {
              name: 'resetView',
              description: 'Reset the camera to the default view showing the entire graph',
              parameters: {
                type: 'object',
                properties: {}
              }
            },
            {
              name: 'getCourseInfo',
              description: 'Get information about a specific course including its modules',
              parameters: {
                type: 'object',
                properties: {
                  courseName: {
                    type: 'string',
                    description: 'The name of the course'
                  }
                },
                required: ['courseName']
              }
            }
          ]
        },
        voice: {
          provider: 'playht',
          voiceId: 'jennifer'
        }
      });
    } catch (error) {
      console.error('Error starting call:', error);
    }
  };

  const endCall = () => {
    if (vapi) {
      vapi.stop();
    }
  };

  return (
    <div className="w-[380px] h-full flex flex-col border-l border-white/10 bg-[#05070d]/90 relative overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center">
            <div className={`w-2 h-2 rounded-full ${isCallActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xs font-semibold tracking-[0.18em] text-white uppercase">Voice Agent</h2>
            <span className="text-[10px] text-slate-500 mt-0.5">
              {isCallActive ? (isSpeaking ? 'Speaking...' : 'Listening...') : 'Offline'}
            </span>
          </div>
        </div>
        <button
          onClick={isCallActive ? endCall : startCall}
          className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${
            isCallActive
              ? 'border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400'
              : 'border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400'
          }`}
        >
          {isCallActive ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}
        </button>
      </div>

      {/* Visualizer Area */}
      <div className="h-[170px] flex items-center justify-center gap-1.5 px-6 py-6 relative z-10 border-b border-white/5">
        {bars.map((bar) => (
          <div
            key={bar.id}
            className={`w-1 rounded-full ${isSpeaking ? 'bg-emerald-400/80 animate-music-bar' : 'bg-slate-700/50'}`}
            style={{
              height: isSpeaking ? `${15 + Math.random() * 60}%` : '20%',
              animationDelay: isSpeaking ? `-${Math.random()}s` : '0s',
              animationDuration: '1.2s'
            }}
          />
        ))}
      </div>

      {/* Transcript / Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-7 z-10 scrollbar-hide">
        {transcript.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
              msg.role === 'assistant'
                ? 'bg-emerald-500/10 border-emerald-500/20'
                : 'bg-white/5 border-white/10'
            }`}>
              {msg.role === 'assistant' ? (
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ) : (
                <span className="text-xs text-slate-200 font-medium">ME</span>
              )}
            </div>
            <div className={`space-y-1 flex-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
              <div className={`flex items-center justify-between ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className="text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
                  {msg.role === 'assistant' ? 'AI Assistant' : 'You'}
                </div>
                <span className="text-[10px] text-slate-600">{msg.time}</span>
              </div>
              <div className={`text-sm leading-relaxed ${msg.role === 'assistant' ? 'text-slate-300' : 'text-white'}`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-white/5 bg-[#05070d]/90 z-20">
        <div className="text-center text-xs text-slate-500 mb-4">
          {isCallActive ? 'Speak naturally to navigate the graph' : 'Click the microphone to start'}
        </div>

        {/* User Profile Snippet */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-slate-700" />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-slate-300">Pavan Kumar</span>
            </div>
          </div>
          <button className="text-[10px] font-medium text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-wide">
            Settings
          </button>
        </div>
      </div>
    </div>
  );
}
