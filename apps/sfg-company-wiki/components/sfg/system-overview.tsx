
'use client'

import React, { useState } from 'react';
import { Lock, Unlock, ChevronRight, AlertTriangle, CheckCircle, Eye, MoreVertical } from 'lucide-react';

export const SFGCompleteUI = () => {
  const [activeSystem, setActiveSystem] = useState('security');
  const [activeStaff, setActiveStaff] = useState('exec');
  const [activeCustomer, setActiveCustomer] = useState('premier');

  // Warren Executive Theme - Security Tiers
  const securityTiers = {
    ceo: {
      label: 'T1 - CEO',
      name: 'CEO / Top Security',
      ribbon: '#0B2A4A',
      opacity: 0.98,
      features: ['Full Access', 'All Files', 'Audit Logs', 'Financial Data', 'Delete', 'Share External', 'Retention Override'],
      access: ['Finance', 'Legal', 'HR', 'Strategic'],
      color: '#0B2A4A'
    },
    finance: {
      label: 'T2 - Finance',
      name: 'Finance / Mid Security',
      ribbon: '#1E5AA0',
      opacity: 0.90,
      features: ['Finance Docs', 'Xero Integration', 'Quote Mgmt', 'No Legal Delete', 'Limited Sharing'],
      access: ['Quotes', 'POs', 'Xero Links', 'Estimations'],
      color: '#1E5AA0'
    },
    sales: {
      label: 'T3 - Sales',
      name: 'Sales / Low Security',
      ribbon: '#7BAEE0',
      opacity: 0.78,
      features: ['Upload', 'Annotate', 'Request Approval', 'No Finance', 'No Delete'],
      access: ['Drawings', 'Proposals', 'Marketing'],
      color: '#7BAEE0'
    }
  };

  // SFG Staff Operational Tiers
  const staffTiers = {
    exec: {
      name: 'Executive Platinum',
      icon: '👑',
      purpose: 'Leadership KPIs & Analytics',
      primary: 'hsl(217, 91%, 60%)',
      ribbon: 'hsl(217, 91%, 60%)',
      roles: ['Warren Heathcote (Operations Lead)', 'Yanika Heathcote (Director)'],
      features: ['Executive Dashboard', 'All Reports', 'Budget Control', 'Staff Oversight', 'Strategic Planning'],
      platforms: ['Chrome', 'Comet Analytics', 'Files Dashboard', 'Docker Extension'],
      security: 'T1 Access'
    },
    ops: {
      name: 'Ops Control Cobalt',
      icon: '⚙️',
      purpose: 'Scheduling & Capacity',
      primary: 'hsl(217, 85%, 52%)',
      ribbon: 'hsl(217, 85%, 52%)',
      roles: ['Pawel Marzec (Operations Manager)', 'Mohammed (Estimating)'],
      features: ['Scheduling', 'Capacity Planning', 'Exception Handling', 'Job Allocation', 'Resource View'],
      platforms: ['Comet Scheduling', 'Teams Tab', 'Files Work Orders'],
      security: 'T1/T2 Access'
    },
    fab: {
      name: 'Fabrication Cyan',
      icon: '🏭',
      purpose: 'Shopfloor WIP & Cut Lists',
      primary: '#0EA5E9',
      ribbon: '#0EA5E9',
      roles: ['Lukasz (Production)', 'Kiosk Operators'],
      features: ['Cut Lists', 'WIP Tracking', 'Quantity Count', 'Barcode Scan', 'Progress Update'],
      platforms: ['Kiosk Displays', 'Barcode Stations', 'Production View'],
      security: 'T2 Access'
    },
    install: {
      name: 'Installations Emerald',
      icon: '🚛',
      purpose: 'RAMS & GPS Check-in',
      primary: '#10B981',
      ribbon: '#10B981',
      roles: ['Mike (Installations)', 'Darren (Site Surveyor)', 'Installation Teams'],
      features: ['GPS Check-in', 'RAMS Forms', 'Photo Upload', 'Signature Capture', 'Delivery Confirmation'],
      platforms: ['Comet Mobile', 'Teams Channel Bot', 'Field App'],
      security: 'T2/T3 Access'
    },
    compliance: {
      name: 'Compliance Amber',
      icon: '✓',
      purpose: 'QC & Finance',
      primary: 'hsl(48, 95%, 55%)',
      ribbon: 'hsl(48, 95%, 55%)',
      roles: ['Mohammed (Estimating)', 'Mikenzie (Xero/Accounts)'],
      features: ['QC Sign-offs', 'T&C Insertion', 'Proforma Mgmt', 'Invoice Check', 'Compliance Docs'],
      platforms: ['Files QC', 'Comet Estimating', 'Accounts Portal'],
      security: 'T1/T2 Access'
    },
    incident: {
      name: 'Incident Crimson',
      icon: '🚨',
      purpose: 'H&S & Critical Issues',
      primary: 'hsl(0, 62%, 50%)',
      ribbon: 'hsl(0, 62%, 50%)',
      roles: ['Warren Heathcote', 'Mike (Installations)', 'Pawel (Operations)'],
      features: ['H&S Alerts', 'P1 Defects', 'War Room Access', 'Escalation', 'Risk Override'],
      platforms: ['Alert Overlays', 'Teams Emergency', 'Dashboard Priority'],
      security: 'T1 Access Only'
    }
  };

  // SFG Customer Tiers
  const customerTiers = {
    premier: {
      name: 'Premier Partner (Gold)',
      label: 'T1 - Premier',
      ribbon: 'hsl(48, 95%, 55%)',
      criteria: 'Strategic/Key Accounts',
      primary: 'hsl(217, 91%, 60%)',
      accent: 'hsl(48, 95%, 55%)',
      features: ['Custom Pricing', 'Priority Support', 'Early Access', 'VIP Badge', 'Extended Terms', 'Dedicated Account Manager'],
      restrictions: 'None - Full Portal Access',
      paymentTerms: 'Net 30+',
      creditLimit: 'High/Flexible'
    },
    preferred: {
      name: 'Preferred (Silver)',
      label: 'T2 - Preferred',
      ribbon: 'hsl(220, 6%, 72%)',
      criteria: 'Repeat/Compliant Accounts',
      primary: 'hsl(217, 91%, 60%)',
      accent: 'hsl(220, 6%, 72%)',
      features: ['Standard Pricing', 'Good Support', 'Portal Access', 'Status Badge', 'Standard Terms', 'Account Support'],
      restrictions: 'Limited to standard products',
      paymentTerms: 'Net 15-20',
      creditLimit: 'Standard'
    },
    standard: {
      name: 'Standard (Steel)',
      label: 'T3 - Standard',
      ribbon: 'hsl(220, 10%, 55%)',
      criteria: 'Default Customers',
      primary: 'hsl(217, 91%, 60%)',
      accent: 'hsl(220, 10%, 55%)',
      features: ['Basic Portal', 'Email Support', 'Quotes Only', 'No Badge', 'Cash/Card', 'Self Service'],
      restrictions: 'Read-only after order',
      paymentTerms: 'Payment Upfront',
      creditLimit: 'None'
    },
    proforma: {
      name: 'Proforma Only (Amber)',
      label: 'T4 - Proforma',
      ribbon: 'hsl(45, 95%, 55%)',
      criteria: 'Prepayment Required',
      primary: 'hsl(217, 91%, 60%)',
      accent: 'hsl(45, 95%, 55%)',
      features: ['Proforma Portal', 'Quote View', 'Order after Payment', 'Pending Badge', 'No Credit', 'Payment Gateway'],
      restrictions: 'Cannot order without prepayment',
      paymentTerms: 'Full Prepayment',
      creditLimit: 'Zero'
    },
    risk: {
      name: 'On Hold / Risk (Crimson)',
      label: 'T5 - Risk',
      ribbon: 'hsl(0, 62%, 50%)',
      criteria: 'Over Limit/High Risk',
      primary: 'hsl(0, 62%, 30%)',
      accent: 'hsl(0, 72%, 40%)',
      features: ['Blocked Portal', 'Request Access', 'Legal Alert', 'Risk Badge', 'Requires Review', 'No New Orders'],
      restrictions: 'BLOCKED - Must contact accounts',
      paymentTerms: 'Past Due Payment',
      creditLimit: 'Exceeded/Suspended'
    }
  };

  const nonNegotiables = [
    { id: 1, title: 'BaseNumber Immutable', critical: true, desc: 'First in subject, filename, folder path. Cannot change.' },
    { id: 2, title: 'Active/Completed Canon', critical: true, desc: 'Month folders are shortcuts only. Do not move job folders.' },
    { id: 3, title: 'Required Fields', critical: true, desc: 'BaseNumber, Prefix, Customer, Project, Location, ProductType, DeliveryType, ENQ_initial_count' },
    { id: 4, title: 'Product Count Chain', critical: true, desc: 'ENQ → QUO (all revs) → ORD → INV → DEL/Collect → PAID. Block QUO→ORD if MISSING.' },
    { id: 5, title: 'Email/Filename Patterns', critical: false, desc: 'Mandatory format. MISSING deviation raises red alert.' },
    { id: 6, title: 'Drawing Workflow Lock', critical: false, desc: '05a→05b→05c→05d→05e→10c. Cannot skip or reorder.' },
    { id: 7, title: 'Approved Docs Lock', critical: false, desc: 'Section 10 locked when populated. Version increment + audit trail required.' },
    { id: 8, title: 'No Client Secrets', critical: true, desc: 'Azure Key Vault only. Abacus.ai API rotation 90 days.' },
    { id: 9, title: 'Anti-Drift Control', critical: false, desc: 'Daily hashing. Major drift disables flows, alerts Governance.' },
    { id: 10, title: 'Xero Decision', critical: false, desc: 'Option A (SFG-first) or B (Xero-first) before go-live.' },
    { id: 11, title: 'Authority to Change', critical: true, desc: 'Warren, Yanika, or Pawel. Minimum 2 of 3 written approval. All changes versioned.' }
  ];

  return (
    <div style={{ background: '#111418', color: 'white', fontFamily: 'Inter, system-ui', minHeight: '100vh' }}>
      {/* Top Nav */}
      <div style={{ background: '#1B2128', borderBottom: '3px solid #2E6FB9', padding: '20px 24px', position: 'sticky', top: 0, zIndex: 1000 }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>SFG Aluminium – Complete System</h1>
        <p style={{ margin: '4px 0 0 0', fontSize: '12px', opacity: 0.6 }}>Warren Executive Theme + Staff Tiers + Customer Tiers + Process Control</p>
      </div>

      {/* System Tabs */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #36414D', display: 'flex', gap: '12px', background: '#1B2128' }}>
        {[
          { id: 'security', label: 'Security Tiers (T1-T3)' },
          { id: 'staff', label: 'Staff Tiers (6 Operational)' },
          { id: 'customer', label: 'Customer Tiers (5 Levels)' },
          { id: 'process', label: 'Process Control' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSystem(tab.id)}
            style={{
              padding: '10px 16px',
              background: activeSystem === tab.id ? '#1E5AA0' : '#27303A',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: activeSystem === tab.id ? 'bold' : 'normal'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* SECURITY TIERS */}
        {activeSystem === 'security' && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Warren Executive Theme – Security Tiers (File 4.0)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {Object.entries(securityTiers).map(([key, tier]) => (
                <div key={key} style={{
                  padding: '20px',
                  background: '#27303A',
                  border: `2px solid ${tier.ribbon}`,
                  borderRadius: '10px',
                  opacity: tier.opacity
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>{tier.label}</h3>
                    <div style={{ width: '40px', height: '24px', background: tier.ribbon, borderRadius: '4px' }} />
                  </div>
                  <p style={{ margin: '0 0 12px 0', fontSize: '12px', opacity: 0.7 }}>{tier.name}</p>
                
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', opacity: 0.5, marginBottom: '6px' }}>ACCESS LIBRARIES</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {tier.access.map((lib, idx) => (
                        <span key={idx} style={{
                          padding: '3px 8px',
                          background: tier.ribbon + '33',
                          borderRadius: '4px',
                          fontSize: '11px'
                        }}>{lib}</span>
                      ))}
                    </div>
                  </div>

                  <div style={{ paddingTop: '12px', borderTop: '1px solid #36414D' }}>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', opacity: 0.5, marginBottom: '6px' }}>FEATURES</div>
                    {tier.features.map((f, idx) => (
                      <div key={idx} style={{ fontSize: '12px', margin: '4px 0' }}>✓ {f}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STAFF TIERS */}
        {activeSystem === 'staff' && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Staff Operational Tiers (6 Functions)</h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              {Object.entries(staffTiers).map(([key, tier]) => (
                <div
                  key={key}
                  onClick={() => setActiveStaff(key)}
                  style={{
                    padding: '20px',
                    background: activeStaff === key ? '#36414D' : '#27303A',
                    border: `2px solid ${tier.ribbon}`,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 120ms ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '24px', marginBottom: '4px' }}>{tier.icon}</div>
                      <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 'bold' }}>{tier.name}</h3>
                      <p style={{ margin: 0, fontSize: '12px', opacity: 0.7 }}>{tier.purpose}</p>
                    </div>
                    <span style={{
                      padding: '6px 12px',
                      background: tier.ribbon,
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: '#000',
                      whiteSpace: 'nowrap'
                    }}>
                      {tier.security}
                    </span>
                  </div>

                  {activeStaff === key && (
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #36414D' }}>
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 'bold', opacity: 0.5, marginBottom: '6px' }}>STAFF</div>
                        {tier.roles.map((role, idx) => (
                          <div key={idx} style={{ fontSize: '12px', margin: '4px 0' }}>• {role}</div>
                        ))}
                      </div>

                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 'bold', opacity: 0.5, marginBottom: '6px' }}>FEATURES</div>
                        {tier.features.map((f, idx) => (
                          <div key={idx} style={{ fontSize: '12px', margin: '4px 0' }}>✓ {f}</div>
                        ))}
                      </div>

                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 'bold', opacity: 0.5, marginBottom: '6px' }}>PLATFORMS</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {tier.platforms.map((p, idx) => (
                            <span key={idx} style={{
                              padding: '4px 8px',
                              background: tier.ribbon + '33',
                              borderRadius: '4px',
                              fontSize: '11px'
                            }}>{p}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CUSTOMER TIERS */}
        {activeSystem === 'customer' && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Customer Portal Tiers (5 Levels)</h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              {Object.entries(customerTiers).map(([key, tier]) => (
                <div
                  key={key}
                  onClick={() => setActiveCustomer(key)}
                  style={{
                    padding: '20px',
                    background: activeCustomer === key ? '#36414D' : '#27303A',
                    border: `2px solid ${tier.ribbon}`,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 120ms ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 'bold' }}>{tier.name}</h3>
                      <p style={{ margin: 0, fontSize: '12px', opacity: 0.7 }}>{tier.criteria}</p>
                    </div>
                    <div style={{
                      padding: '6px 12px',
                      background: tier.ribbon,
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      color: tier.label === 'T1 - Premier' ? '#000' : '#fff'
                    }}>
                      {tier.label}
                    </div>
                  </div>

                  {activeCustomer === key && (
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #36414D' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '12px' }}>
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 'bold', opacity: 0.5, marginBottom: '6px' }}>PAYMENT TERMS</div>
                          <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{tier.paymentTerms}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 'bold', opacity: 0.5, marginBottom: '6px' }}>CREDIT LIMIT</div>
                          <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{tier.creditLimit}</div>
                        </div>
                      </div>

                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 'bold', opacity: 0.5, marginBottom: '6px' }}>FEATURES</div>
                        {tier.features.map((f, idx) => (
                          <div key={idx} style={{ fontSize: '12px', margin: '4px 0' }}>✓ {f}</div>
                        ))}
                      </div>

                      <div style={{
                        padding: '12px',
                        background: tier.ribbon + '22',
                        border: `1px solid ${tier.ribbon}`,
                        borderRadius: '6px'
                      }}>
                        <div style={{ fontSize: '11px', fontWeight: 'bold', opacity: 0.7 }}>RESTRICTIONS</div>
                        <div style={{ fontSize: '12px', marginTop: '4px' }}>{tier.restrictions}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROCESS CONTROL */}
        {activeSystem === 'process' && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Non-Negotiable Rules (11 Locked)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {nonNegotiables.map((rule) => (
                <div key={rule.id} style={{
                  padding: '16px',
                  background: '#27303A',
                  border: `2px solid ${rule.critical ? '#B8322B' : '#C17D00'}`,
                  borderRadius: '10px'
                }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'start', marginBottom: '8px' }}>
                    {rule.critical ? (
                      <AlertTriangle size={18} style={{ color: '#B8322B', flexShrink: 0 }} />
                    ) : (
                      <CheckCircle size={18} style={{ color: '#C17D00', flexShrink: 0 }} />
                    )}
                    <div style={{
                      fontSize: '11px',
                      fontWeight: 'bold',
                      color: rule.critical ? '#B8322B' : '#C17D00'
                    }}>
                      {rule.critical ? 'CRITICAL' : 'HIGH'}
                    </div>
                  </div>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', fontWeight: 'bold' }}>{rule.title}</h4>
                  <p style={{ margin: 0, fontSize: '12px', opacity: 0.7 }}>{rule.desc}</p>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: '24px',
              padding: '16px',
              background: '#27303A',
              border: '2px solid #0B2A4A',
              borderRadius: '10px'
            }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
                <Lock size={20} style={{ color: '#0B2A4A' }} />
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>Authority to Change</h3>
              </div>
              <p style={{ margin: '0 0 12px 0', fontSize: '12px', opacity: 0.8 }}>
                Only these roles may approve Non-Negotiable changes:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {['Warren Heathcote\n(Operations Manager)', 'Yanika Heathcote\n(Admin/Director)', 'Pawel Marzec\n(Operations Manager)'].map((name, idx) => (
                  <div key={idx} style={{
                    padding: '12px',
                    background: '#0B2A4A',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    whiteSpace: 'pre-line'
                  }}>
                    {name}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '12px', fontSize: '12px', opacity: 0.7 }}>
                <strong>Process:</strong> Written approval from minimum 2 of 3. All changes versioned and logged in Anti-Drift baseline.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
