
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

async function validateApiKey(apiKey: string | null) {
  if (!apiKey) return false;
  
  try {
    const config = await prisma.configuration.findUnique({
      where: { key: `api_key_${apiKey}` },
    });
    
    if (!config) return false;
    const keyData = JSON.parse(config.value);
    return keyData.active === true;
  } catch {
    return false;
  }
}

// Logikal System Integration Endpoint
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get('api_key') || request.headers.get('x-api-key');
    
    if (!await validateApiKey(apiKey)) {
      return NextResponse.json({ error: 'Invalid or missing API key' }, { status: 401 });
    }

    const { action, filePath, projectData, logikalConfig } = await request.json();
    
    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 });
    }

    // Log the Logikal integration request
    await prisma.systemLog.create({
      data: {
        level: 'info',
        message: 'Logikal Integration Request',
        details: JSON.stringify({ 
          action,
          filePath: filePath?.substring(0, 100) || null,
          hasProjectData: !!projectData,
          hasConfig: !!logikalConfig,
          timestamp: new Date().toISOString()
        })
      }
    });

    let response: any;

    switch (action) {
      case 'sync_project_data':
        response = {
          status: 'sync_ready',
          logikal: {
            projectSync: {
              status: 'ready_for_implementation',
              supportedFormats: ['DXF', 'DWG', '3D Models', 'Project Files'],
              syncCapabilities: [
                'Bidirectional data sync',
                'Real-time project updates',
                'File system monitoring',
                'Automated backups'
              ]
            },
            folderStructure: {
              monitoring: 'not_active',
              autoSync: 'pending_setup',
              lastSync: null
            }
          },
          metadata: {
            timestamp: new Date().toISOString(),
            requestId: `logikal_${Date.now()}`,
            integrationLevel: 'phase_1_ready'
          }
        };
        break;
        
      case 'file_analysis':
        response = {
          status: 'analysis_ready',
          fileAnalysis: {
            capabilities: [
              'Drawing file processing',
              'Project cost estimation',
              'Material optimization',
              'Quality checks'
            ],
            supportedExtensions: ['.dwg', '.dxf', '.step', '.iges', '.pdf'],
            aiProcessing: 'available'
          },
          metadata: {
            timestamp: new Date().toISOString(),
            requestId: `logikal_${Date.now()}`,
            integrationLevel: 'phase_1_ready'
          }
        };
        break;
        
      case 'get_project_structure':
        response = {
          status: 'structure_available',
          projectStructure: {
            rootPath: 'C:\\Logikal\\Projects',
            structure: [
              'Active Projects/',
              'Templates/',
              'Archive/',
              'Reports/',
              'Calculations/'
            ],
            integrationPoints: [
              'Project files monitoring',
              'Report generation',
              'Cost calculation sync',
              'Quality control integration'
            ]
          },
          metadata: {
            timestamp: new Date().toISOString(),
            requestId: `logikal_${Date.now()}`,
            integrationLevel: 'phase_1_ready'
          }
        };
        break;
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Logikal integration error:', error);
    return NextResponse.json(
      { error: 'Failed to process Logikal integration' },
      { status: 500 }
    );
  }
}

// Get Logikal integration status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get('api_key') || request.headers.get('x-api-key');
    
    if (!await validateApiKey(apiKey)) {
      return NextResponse.json({ error: 'Invalid or missing API key' }, { status: 401 });
    }

    const logikalStatus = {
      logikal: {
        connectionStatus: 'ready_for_setup',
        version: 'Unknown - Pending Connection',
        features: {
          fileSystemAccess: 'not_configured',
          projectSync: 'pending',
          aiAnalysis: 'available',
          reportGeneration: 'pending'
        },
        capabilities: [
          'Project file analysis',
          'Cost estimation integration',
          'Quality control automation',
          'Drawing optimization',
          'Material planning sync'
        ],
        requiredSetup: [
          'File system access configuration',
          'Project directory mapping',
          'Real-time sync enable',
          'API webhook setup'
        ]
      },
      integrationPhases: {
        phase1: {
          name: 'Foundation & API Setup',
          status: 'in_progress',
          components: ['API endpoints', 'Authentication', 'Basic monitoring']
        },
        phase2: {
          name: 'File System Integration',
          status: 'pending',
          components: ['Directory monitoring', 'File processing', 'Data sync']
        },
        phase3: {
          name: 'AI Enhancement',
          status: 'planned',
          components: ['Smart analysis', 'Predictive features', 'Automation']
        }
      },
      lastChecked: new Date().toISOString()
    };

    return NextResponse.json(logikalStatus);
  } catch (error) {
    console.error('Logikal status error:', error);
    return NextResponse.json(
      { error: 'Failed to check Logikal status' },
      { status: 500 }
    );
  }
}
