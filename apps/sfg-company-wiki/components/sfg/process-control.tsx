
'use client'

import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Clock, AlertTriangle, Lock, Unlock, ChevronRight, Plus, Settings, Eye, MoreVertical, Copy, Archive } from 'lucide-react';

export const SFGProcessUI = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [showNonNegotiables, setShowNonNegotiables] = useState(false);

  const statusColors: Record<string, string> = {
    ENQ: '#FFFFFF',
    QUO: '#2E6FB9',
    ORD: '#C17D00',
    INV: '#9333EA',
    DEL: '#001F3F',
    PAID: '#1E8959',
    MISSING: '#B8322B'
  };

  const projects = [
    {
      id: 1,
      baseNumber: '2025-001',
      prefix: 'SFG',
      customer: 'Acme Construction Ltd',
      project: 'Office Refurb Phase 2',
      location: 'London, UK',
      productType: 'Aluminum Frames',
      deliveryType: 'Supply&Install',
      status: 'ORD',
      enquiryCount: 45,
      productCount: 45,
      preparedCount: 42,
      deliveredCount: 0,
      daysActive: 23,
      lastUpdate: '2025-10-05',
      issues: ['MISSING', 'ProductCountChange'],
      contacts: { primary: 'John Smith', accounts: 'Sarah Jones' }
    },
    {
      id: 2,
      baseNumber: '2025-002',
      prefix: 'SFG',
      customer: 'BuildTech Solutions',
      project: 'Factory Extension',
      location: 'Manchester, UK',
      productType: 'Structural Components',
      deliveryType: 'SupplyOnly',
      status: 'QUO',
      enquiryCount: 120,
      productCount: 120,
      preparedCount: 0,
      deliveredCount: 0,
      daysActive: 8,
      lastUpdate: '2025-10-06',
      issues: [],
      contacts: { primary: 'Emma Watson', accounts: 'David Miller' }
    },
    {
      id: 3,
      baseNumber: '2025-003',
      prefix: 'SFG',
      customer: 'Premier Windows Ltd',
      project: 'Residential Complex',
      location: 'Birmingham, UK',
      productType: 'Window Frames',
      deliveryType: 'Collected',
      status: 'PAID',
      enquiryCount: 280,
      productCount: 280,
      preparedCount: 280,
      deliveredCount: 280,
      daysActive: 67,
      lastUpdate: '2025-10-03',
      issues: [],
      contacts: { primary: 'Robert Chen', accounts: 'Lisa Park' }
    }
  ];

  const nonNegotiables = [
    { id: 1, title: 'BaseNumber Immutable', desc: 'BaseNumber is immutable and always first in subject, filename, and folder path', severity: 'critical' },
    { id: 2, title: 'Active/Completed Canon', desc: 'Active and Completed are canonical roots. Month folders are shortcuts only.', severity: 'critical' },
    { id: 3, title: 'Required Fields', desc: 'Must have: BaseNumber, Prefix, Customer, Project, Location, ProductType, DeliveryType, ENQ_initial_count', severity: 'critical' },
    { id: 4, title: 'Product Count Chain', desc: 'Maintain count ENQ → QUO (all revs) → ORD → INV → DEL/Collect → PAID', severity: 'critical' },
    { id: 5, title: 'Email/Filename Patterns', desc: 'Subjects and filenames must follow defined patterns precisely. Deviation raises red alert.', severity: 'high' },
    { id: 6, title: 'Drawing Workflow', desc: '05a → 05b → 05c → 05d → 05e locked sequence. Approved to 10c, rejected to 05g.', severity: 'high' },
    { id: 7, title: 'Approved Docs Lock', desc: 'Section 10 locked when populated. Changes require version increment + audit trail.', severity: 'high' },
    { id: 8, title: 'No Client Secrets', desc: 'No secrets client-side. Azure Key Vault only. Abacus.ai API rotation every 90 days.', severity: 'critical' },
    { id: 9, title: 'Anti-Drift Control', desc: 'Daily baseline hashing. Major drift disables flows and alerts Governance.', severity: 'high' },
    { id: 10, title: 'Xero Decision', desc: 'Option A (SFG-first) or B (Xero-first) must be decided before production go-live.', severity: 'high' }
  ];

  const folderStructure = [
    { num: '01', name: 'Enquiry', nested: false },
    { num: '02', name: 'Customer Replies', nested: false },
    { num: '03', name: 'SFG Quotes', nested: false },
    { num: '04', name: 'Customer Orders (Inbound)', nested: false },
    { num: '05', name: 'Drawings', nested: true, children: ['05a Incoming', '05b SFG Issue', '05c Change Requests', '05d Confirmations', '05e Approval', '05f Live', '05g Rejected'] },
    { num: '06', name: 'Site Photos', nested: false },
    { num: '07', name: 'Customers', nested: true, children: ['07a RFQs', '07b POs'] },
    { num: '08', name: 'Waiting For Approval', nested: false },
    { num: '09', name: 'Invoicing', nested: false },
    { num: '10', name: 'Approved Documents', nested: true, children: ['10a Quote Approved', '10b PO Received', '10c Drawing Approved', '10d Agreements Mirror'], locked: true },
  ];

  const drawingWorkflow = [
    { stage: '05a', name: 'Incoming Requests', color: '#D3E3F6' },
    { stage: '05b', name: 'SFG Issue', color: '#A6C7EC' },
    { stage: '05c', name: 'Change Requests', color: '#7BAEE0' },
    { stage: '05d', name: 'Confirmations', color: '#4C8DCE' },
    { stage: '05e', name: 'Approval', color: '#2E6FB9' },
    { stage: '↓', name: 'Promote to 10c', color: '#1E5AA0' },
    { stage: '10c', name: 'Drawing Approved (Locked)', color: '#0B2A4A' },
  ];

  type Project = typeof projects[0];
  
  const ProductCountDisplay = ({ project }: { project: Project }) => {
    const stages = [
      { label: 'ENQ', count: project.enquiryCount },
      { label: 'QUO', count: project.productCount },
      { label: 'ORD', count: project.productCount },
      { label: 'Prepared', count: project.preparedCount },
      { label: 'DEL', count: project.deliveredCount }
    ];

    return (
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '12px' }}>
        {stages.map((stage, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              padding: '6px 12px',
              background: '#36414D',
              border: '1px solid #4A5562',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              <span style={{ opacity: 0.6 }}>{stage.label}: </span>
              <span>{stage.count}</span>
            </div>
            {idx < stages.length - 1 && <ChevronRight size={16} style={{ opacity: 0.5 }} />}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ background: '#111418', color: 'white', fontFamily: 'Inter, system-ui, -apple-system, sans-serif', minHeight: '100vh' }}>
      {/* Top Nav */}
      <div style={{
        background: '#1B2128',
        borderBottom: '3px solid #2E6FB9',
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>SFG Aluminium – Process Control</h1>
          <p style={{ fontSize: '12px', opacity: 0.6, margin: '4px 0 0 0' }}>Project Management & Non-Negotiable Enforcement</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{
            padding: '10px 16px',
            background: showNonNegotiables ? '#2E6FB9' : '#36414D',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }} onClick={() => setShowNonNegotiables(!showNonNegotiables)}>
            Non-Negotiables {showNonNegotiables && '✓'}
          </button>
          <button style={{
            padding: '10px 16px',
            background: '#1E5AA0',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            + New Project
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '24px' }}>
        {showNonNegotiables ? (
          // Non-Negotiables View
          <div style={{ maxWidth: '1200px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Authority to Change – Non-Negotiables (Locked)</h2>
            <div style={{
              padding: '16px',
              background: '#27303A',
              border: '2px solid #B8322B',
              borderRadius: '10px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'start', marginBottom: '12px' }}>
                <Lock size={20} style={{ color: '#B8322B', marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>Approval Authority</div>
                  <div style={{ fontSize: '12px', opacity: 0.8 }}>Only these roles may approve changes:</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '8px' }}>
                    {['Warren Heathcote (Operations Manager)', 'Yanika Heathcote (Admin/Director)', 'Pawel Marzec (Operations Manager)'].map((name, idx) => (
                      <div key={idx} style={{
                        padding: '8px 12px',
                        background: '#0B2A4A',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {name}
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: '12px', marginTop: '12px', opacity: 0.7 }}>
                    Process: Written approval from <strong>at least 2 of 3</strong>. All changes versioned and logged in Anti-Drift baseline.
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {nonNegotiables.map((item) => (
                <div key={item.id} style={{
                  padding: '16px',
                  background: '#27303A',
                  border: `2px solid ${item.severity === 'critical' ? '#B8322B' : '#C17D00'}`,
                  borderRadius: '10px'
                }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'start', marginBottom: '8px' }}>
                    {item.severity === 'critical' ? (
                      <AlertTriangle size={18} style={{ color: '#B8322B', flexShrink: 0 }} />
                    ) : (
                      <Clock size={18} style={{ color: '#C17D00', flexShrink: 0 }} />
                    )}
                    <div style={{
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: item.severity === 'critical' ? '#B8322B' : '#C17D00'
                    }}>
                      {item.severity.toUpperCase()}
                    </div>
                  </div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }}>{item.title}</h4>
                  <p style={{ margin: 0, fontSize: '12px', opacity: 0.7 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Projects View
          <>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              {['overview', 'drawings', 'folder', 'product-count'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '10px 16px',
                    background: activeTab === tab ? '#1E5AA0' : '#27303A',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: activeTab === tab ? 'bold' : 'normal'
                  }}
                >
                  {tab === 'overview' && 'Active Projects'}
                  {tab === 'drawings' && 'Drawing Workflow'}
                  {tab === 'folder' && 'Folder Structure'}
                  {tab === 'product-count' && 'Product Count Chain'}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
              <div style={{ display: 'grid', gap: '16px' }}>
                {projects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProject(project.id)}
                    style={{
                      padding: '20px',
                      background: '#27303A',
                      border: `1px solid ${project.issues.length > 0 ? '#B8322B' : '#4A5562'}`,
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'all 120ms ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{project.baseNumber}-{project.prefix}</span>
                          <span style={{
                            padding: '4px 12px',
                            background: statusColors[project.status],
                            color: project.status === 'ENQ' ? '#000' : '#fff',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 'bold'
                          }}>
                            {project.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>{project.customer}</div>
                        <div style={{ fontSize: '12px', opacity: 0.7 }}>{project.project} • {project.location}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        {project.issues.length > 0 && (
                          <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end', marginBottom: '8px' }}>
                            {project.issues.map((issue) => (
                              <span key={issue} style={{
                                padding: '4px 8px',
                                background: '#B8322B',
                                borderRadius: '4px',
                                fontSize: '10px',
                                fontWeight: 'bold'
                              }}>
                                {issue}
                              </span>
                            ))}
                          </div>
                        )}
                        <div style={{ fontSize: '12px', opacity: 0.6 }}>{project.daysActive} days active</div>
                      </div>
                    </div>

                    <ProductCountDisplay project={project} />

                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #36414D' }}>
                      {[
                        { icon: Eye, label: 'View' },
                        { icon: Copy, label: 'Duplicate' },
                        { icon: Archive, label: 'Archive' }
                      ].map((action, idx) => (
                        <button key={idx} style={{
                          padding: '6px 12px',
                          background: '#36414D',
                          border: 'none',
                          borderRadius: '6px',
                          color: '#2E6FB9',
                          cursor: 'pointer',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontWeight: 'bold'
                        }}>
                          <action.icon size={14} />
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'drawings' && (
              <div style={{ padding: '24px', background: '#27303A', borderRadius: '10px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px' }}>Drawing Workflow (Non-Negotiable Sequence)</h3>
                <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '16px' }}>
                  {drawingWorkflow.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        padding: '12px 16px',
                        background: item.color,
                        borderRadius: '8px',
                        minWidth: '120px',
                        textAlign: 'center',
                        color: '#000',
                        fontWeight: 'bold',
                        fontSize: '13px'
                      }}>
                        <div style={{ fontSize: '11px', opacity: 0.7 }}>{item.stage}</div>
                        <div style={{ fontSize: '12px', marginTop: '4px' }}>{item.name}</div>
                      </div>
                      {idx < drawingWorkflow.length - 1 && <ChevronRight size={20} style={{ opacity: 0.5 }} />}
                    </div>
                  ))}
                </div>
                <div style={{
                  padding: '16px',
                  background: '#36414D',
                  borderLeft: '4px solid #1E5AA0',
                  borderRadius: '6px',
                  marginTop: '20px',
                  fontSize: '12px'
                }}>
                  <strong>Locked Rule:</strong> No skipping steps. 05a→05b→05c→05d→05e sequence cannot be reordered. Approved drawings promote to 10c and lock previous versions. Rejected designs move to 05g. Live working drawings maintained in 05f.
                </div>
              </div>
            )}

            {activeTab === 'folder' && (
              <div style={{ padding: '24px', background: '#27303A', borderRadius: '10px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px' }}>Canonical Folder Structure (Immutable Order)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  {folderStructure.map((folder, idx) => (
                    <div key={idx} style={{
                      padding: '12px',
                      background: folder.locked ? '#36414D99' : '#36414D',
                      border: `1px solid ${folder.locked ? '#1E5AA0' : '#4A5562'}`,
                      borderRadius: '6px',
                      opacity: folder.locked ? 0.8 : 1
                    }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#2E6FB9' }}>{folder.num}</span>
                        <span style={{ fontWeight: 'bold', fontSize: '13px' }}>{folder.name}</span>
                        {folder.locked && <Lock size={14} style={{ color: '#1E5AA0', marginLeft: 'auto' }} />}
                      </div>
                      {folder.children && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {folder.children.map((child) => (
                            <span key={child} style={{
                              padding: '4px 8px',
                              background: '#4A5562',
                              borderRadius: '4px',
                              fontSize: '11px',
                              opacity: 0.8
                            }}>
                              {child}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'product-count' && (
              <div style={{ padding: '24px', background: '#27303A', borderRadius: '10px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px' }}>Product Count Chain (Immutable Tracking)</h3>
                <div style={{
                  padding: '16px',
                  background: '#36414D',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  fontSize: '13px',
                  lineHeight: '1.6'
                }}>
                  <strong>Rule:</strong> Maintain count from ENQ → QUO (all revisions) → ORD → INV → DEL/Collect → PAID
                  <div style={{ marginTop: '12px', opacity: 0.8 }}>
                    • Count complete deliverables with own price<br />
                    • Separately priced accessories count; consumables do not<br />
                    • QUO→ORD blocked if ENQ_initial_count or Current_product_count is MISSING<br />
                    • On count change: log ProductCountLog, post Teams alert, create Planner task for Estimator self-sign
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '12px' }}>
                  {projects.map((p) => (
                    <div key={p.id} style={{
                      padding: '12px',
                      background: '#36414D',
                      border: '1px solid #4A5562',
                      borderRadius: '6px'
                    }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>{p.baseNumber}: {p.customer}</div>
                      <ProductCountDisplay project={p} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
