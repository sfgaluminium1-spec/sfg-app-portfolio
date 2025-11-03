
'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Shield, AlertTriangle, TrendingUp, TrendingDown, Check, X, Clock, DollarSign, Target, Lock } from 'lucide-react';

export const CreditCheckingUI = () => {
  const [viewMode, setViewMode] = useState('search');
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [creditCheckResult, setCreditCheckResult] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [tierAssignment, setTierAssignment] = useState<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const mockCustomers = [
    { id: 1, name: 'ABC Manufacturing Ltd', companyNumber: '12345678', currentTier: 'Steel', lastCheck: '2025-10-01' },
    { id: 2, name: 'XYZ Installations plc', companyNumber: '87654321', currentTier: 'Platinum', lastCheck: '2025-10-10' },
    { id: 3, name: 'Prime Components Ltd', companyNumber: '11223344', currentTier: 'Proforma', lastCheck: '2025-09-20' },
    { id: 4, name: 'Global Trading Co', companyNumber: '55667788', currentTier: 'Crimson', lastCheck: '2025-10-05' },
    { id: 5, name: 'Quality Builders Ltd', companyNumber: '99887766', currentTier: 'Sapphire', lastCheck: '2025-10-08' }
  ];

  // Simulate credit checking with Experian API
  const performCreditCheck = (customer: any) => {
    setIsChecking(true);
  
    setTimeout(() => {
      // Simulated credit data
      const creditData = {
        companyName: customer.name,
        companyNumber: customer.companyNumber,
        creditScore: Math.floor(Math.random() * 100) + 50,
        riskLevel: ['Low', 'Medium', 'High', 'Legal', 'Insolvency'][Math.floor(Math.random() * 5)],
        creditLimit: Math.floor(Math.random() * 500000) + 50000,
        currentDebt: Math.floor(Math.random() * 100000),
        agedReceivables45: Math.floor(Math.random() * 5),
        agedReceivables60: Math.floor(Math.random() * 3),
        avgMonthlyBilled6m: Math.floor(Math.random() * 200000) + 5000,
        annualBilled: Math.floor(Math.random() * 1500000) + 50000,
        onTimePaymentRatio: parseFloat((Math.random() * 0.5 + 0.5).toFixed(2)),
        ordersPerYear: Math.floor(Math.random() * 50) + 1,
        paymentTerms: ['30 Days', 'Proforma', 'COD'][Math.floor(Math.random() * 3)],
        frameworkContract: Math.random() > 0.7,
        checkProvider: 'Experian',
        checkDate: new Date().toISOString()
      };
    
      setCreditCheckResult(creditData);
    
      // Compute tier assignment
      const assignedTier = computeTier(creditData);
      setTierAssignment(assignedTier);
      setIsChecking(false);
    }, 2000);
  };

  // Deterministic tier assignment function
  const computeTier = (data: any) => {
    const overLimitPct = (data.currentDebt / data.creditLimit) * 100;
  
    // TIER 5: CRIMSON (Risk/On Hold) - HIGHEST PRIORITY
    if (
      overLimitPct > 20 ||
      data.agedReceivables60 > 0 ||
      data.riskLevel === 'Legal' ||
      data.riskLevel === 'Insolvency'
    ) {
      return {
        tier: 'Crimson',
        level: 5,
        color: '#7f1d1d',
        accentColor: '#fecaca',
        icon: Lock,
        precedence: 'HIGHEST',
        reason: 'Credit stop triggered - Risk assessment indicates payment risk',
        actions: ['Block all orders', 'Alert Finance team', 'Require manual approval', 'Weekly monitoring']
      };
    }
  
    // TIER 4: GREEN (Proforma Only) - PRIORITY 2
    if (
      data.paymentTerms === 'Proforma' ||
      data.onTimePaymentRatio < 0.80 ||
      data.agedReceivables45 > 0 ||
      data.riskLevel === 'High'
    ) {
      return {
        tier: 'Green (Proforma)',
        level: 4,
        color: '#065f46',
        accentColor: '#d1fae5',
        icon: Clock,
        precedence: 'PRIORITY 2',
        reason: 'Payment verification required - Elevated payment risk detected',
        actions: ['Require payment on delivery', 'Monitor closely', 'Potential upgrade after 6 on-time payments', 'Daily tracking']
      };
    }
  
    // TIER 1: BLUE (Premier Partner - Platinum) - PRIORITY 3
    if (
      (data.avgMonthlyBilled6m >= 50000 || data.annualBilled >= 500000) &&
      data.onTimePaymentRatio >= 0.95 &&
      data.riskLevel === 'Low' &&
      data.paymentTerms !== 'Proforma'
    ) {
      return {
        tier: 'Platinum (Premier)',
        level: 1,
        color: '#1e40af',
        accentColor: '#dbeafe',
        icon: Target,
        precedence: 'PRIORITY 3',
        reason: 'Premium customer - Excellent payment history and high volume',
        actions: ['Premium benefits', 'Extended payment terms', 'Priority support', 'Quarterly business review']
      };
    }
  
    // TIER 2: GREY (Preferred - Sapphire) - PRIORITY 4
    if (
      (data.avgMonthlyBilled6m >= 15000 || data.ordersPerYear >= 12) &&
      data.onTimePaymentRatio >= 0.90 &&
      (data.riskLevel === 'Low' || data.riskLevel === 'Medium') &&
      data.paymentTerms !== 'Proforma'
    ) {
      return {
        tier: 'Sapphire (Preferred)',
        level: 2,
        color: '#334155',
        accentColor: '#e2e8f0',
        icon: TrendingUp,
        precedence: 'PRIORITY 4',
        reason: 'Preferred customer - Good payment history and regular business',
        actions: ['Standard benefits', 'Good payment terms', 'Monthly check-in', 'Growth opportunities']
      };
    }
  
    // TIER 3: STEEL (Standard) - DEFAULT
    return {
      tier: 'Steel (Standard)',
      level: 3,
      color: '#475569',
      accentColor: '#e2e8f0',
      icon: Shield,
      precedence: 'DEFAULT',
      reason: 'Standard tier - Normal credit profile, requires ongoing monitoring',
      actions: ['Standard terms', 'Monthly review', 'Credit check every 90 days', 'Monitor for upgrade']
    };
  };

  // 3D Background Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class BackgroundParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;

      constructor() {
        this.x = Math.random() * (canvas?.width || 1000);
        this.y = Math.random() * (canvas?.height || 1000);
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        this.size = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        const canvasWidth = canvas?.width || 1000;
        const canvasHeight = canvas?.height || 1000;
        if (this.x < 0) this.x = canvasWidth;
        if (this.x > canvasWidth) this.x = 0;
        if (this.y < 0) this.y = canvasHeight;
        if (this.y > canvasHeight) this.y = 0;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = 'rgba(71, 85, 105, 0.3)';
        ctx.fillRect(this.x, this.y, this.size, this.size);
      }
    }

    const particles = Array.from({ length: 50 }, () => new BackgroundParticle());

    const animate = () => {
      if (!ctx) return;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredCustomers = mockCustomers.filter(c => 
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.companyNumber.includes(customerSearch)
  );

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />

      {/* Header */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '72px', background: '#1e293b', borderBottom: '4px solid #3b82f6', zIndex: 100, display: 'flex', alignItems: 'center', padding: '0 32px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
        <div style={{ fontSize: '20px', fontWeight: '700', color: '#e2e8f0' }}>SFG Credit Checking System</div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <button onClick={() => setViewMode('search')} style={{ padding: '8px 16px', background: viewMode === 'search' ? '#3b82f6' : 'transparent', color: '#cbd5e1', border: '2px solid #3b82f6', borderRadius: '4px', fontWeight: '600', cursor: 'pointer', fontSize: '12px' }}>Search</button>
          <button onClick={() => setViewMode('history')} style={{ padding: '8px 16px', background: viewMode === 'history' ? '#3b82f6' : 'transparent', color: '#cbd5e1', border: '2px solid #3b82f6', borderRadius: '4px', fontWeight: '600', cursor: 'pointer', fontSize: '12px' }}>History</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ position: 'relative', zIndex: 10, padding: '100px 40px 40px', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
          {viewMode === 'search' && (
            <>
              {/* Search Panel */}
              <div style={{ background: '#1e40af', backdropFilter: 'blur(16px)', border: '4px solid transparent', backgroundImage: 'linear-gradient(#1e40af, #1e40af), linear-gradient(135deg, #94a3b8 0%, #cbd5e1 50%, #94a3b8 100%)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', borderRadius: '4px', padding: '28px', marginBottom: '32px', boxShadow: '0 12px 40px rgba(0,0,0,0.6)' }}>
                <h2 style={{ color: '#f1f5f9', fontSize: '22px', fontWeight: '700', marginBottom: '20px' }}>Search Customer for Credit Check</h2>
              
                <input 
                  type="text" 
                  placeholder="Enter customer name or company number..." 
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '6px', border: '2px solid #cbd5e1', fontSize: '14px', marginBottom: '16px', background: '#f1f5f9', color: '#0f172a' }}
                />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                  {filteredCustomers.map(customer => (
                    <button 
                      key={customer.id}
                      onClick={() => {
                        setSelectedCustomer(customer);
                        performCreditCheck(customer);
                      }}
                      style={{ background: selectedCustomer?.id === customer.id ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '8px', padding: '16px', cursor: 'pointer', textAlign: 'left', color: '#f1f5f9', transition: 'all 0.2s' }}
                    >
                      <div style={{ fontWeight: '600', marginBottom: '6px' }}>{customer.name}</div>
                      <div style={{ fontSize: '12px', color: '#dbeafe', marginBottom: '4px' }}>Co #: {customer.companyNumber}</div>
                      <div style={{ fontSize: '11px', color: '#cbd5e1' }}>Current: {customer.currentTier}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Credit Check Results */}
              {isChecking && (
                <div style={{ background: '#1e40af', backdropFilter: 'blur(16px)', border: '4px solid transparent', backgroundImage: 'linear-gradient(#1e40af, #1e40af), linear-gradient(135deg, #94a3b8 0%, #cbd5e1 50%, #94a3b8 100%)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', borderRadius: '4px', padding: '28px', textAlign: 'center' }}>
                  <div style={{ color: '#f1f5f9', fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Checking Credit with Experian...</div>
                  <div style={{ width: '60px', height: '60px', border: '4px solid rgba(255,255,255,0.3)', borderTop: '4px solid #f1f5f9', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
                </div>
              )}

              {creditCheckResult && !isChecking && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  {/* Left: Credit Data */}
                  <div style={{ background: '#1e40af', backdropFilter: 'blur(16px)', border: '4px solid transparent', backgroundImage: 'linear-gradient(#1e40af, #1e40af), linear-gradient(135deg, #94a3b8 0%, #cbd5e1 50%, #94a3b8 100%)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', borderRadius: '4px', padding: '24px' }}>
                    <h3 style={{ color: '#f1f5f9', fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Credit Metrics</h3>
                  
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ color: '#cbd5e1', fontSize: '12px', marginBottom: '4px' }}>Credit Score</div>
                      <div style={{ color: '#f1f5f9', fontSize: '28px', fontWeight: '700' }}>{creditCheckResult.creditScore}</div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '6px' }}>
                        <div style={{ color: '#cbd5e1', fontSize: '11px', marginBottom: '4px' }}>Credit Limit</div>
                        <div style={{ color: '#dbeafe', fontSize: '16px', fontWeight: '700' }}>£{creditCheckResult.creditLimit.toLocaleString()}</div>
                      </div>
                      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '6px' }}>
                        <div style={{ color: '#cbd5e1', fontSize: '11px', marginBottom: '4px' }}>Current Debt</div>
                        <div style={{ color: '#fca5a5', fontSize: '16px', fontWeight: '700' }}>£{creditCheckResult.currentDebt.toLocaleString()}</div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '6px' }}>
                        <div style={{ color: '#cbd5e1', fontSize: '11px', marginBottom: '4px' }}>On-Time Ratio</div>
                        <div style={{ color: '#86efac', fontSize: '16px', fontWeight: '700' }}>{(creditCheckResult.onTimePaymentRatio * 100).toFixed(0)}%</div>
                      </div>
                      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '6px' }}>
                        <div style={{ color: '#cbd5e1', fontSize: '11px', marginBottom: '4px' }}>Annual Billed</div>
                        <div style={{ color: '#dbeafe', fontSize: '16px', fontWeight: '700' }}>£{creditCheckResult.annualBilled.toLocaleString()}</div>
                      </div>
                    </div>

                    <div style={{ marginTop: '16px', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '6px' }}>
                      <div style={{ color: '#cbd5e1', fontSize: '11px', marginBottom: '4px' }}>Risk Level</div>
                      <div style={{ color: creditCheckResult.riskLevel === 'Low' ? '#86efac' : creditCheckResult.riskLevel === 'High' ? '#fca5a5' : '#fbbf24', fontSize: '14px', fontWeight: '700' }}>{creditCheckResult.riskLevel}</div>
                    </div>
                  </div>

                  {/* Right: Tier Assignment */}
                  {tierAssignment && (
                    <div style={{ background: tierAssignment.color, backdropFilter: 'blur(16px)', border: '4px solid transparent', backgroundImage: `linear-gradient(${tierAssignment.color}, ${tierAssignment.color}), linear-gradient(135deg, #94a3b8 0%, #cbd5e1 50%, #94a3b8 100%)`, backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', borderRadius: '4px', padding: '24px', color: '#fef2f2', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <tierAssignment.icon style={{ width: '32px', height: '32px' }} />
                        <div>
                          <div style={{ fontSize: '14px', opacity: 0.9 }}>ASSIGNED TIER</div>
                          <div style={{ fontSize: '24px', fontWeight: '700' }}>{tierAssignment.tier}</div>
                        </div>
                      </div>

                      <div style={{ background: 'rgba(0,0,0,0.25)', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>
                        <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>PRECEDENCE: {tierAssignment.precedence}</div>
                        <div style={{ fontSize: '13px', lineHeight: '1.6' }}>{tierAssignment.reason}</div>
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>REQUIRED ACTIONS:</div>
                        <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', lineHeight: '1.8' }}>
                          {tierAssignment.actions.map((action: string, i: number) => <li key={i}>{action}</li>)}
                        </ul>
                      </div>

                      <button style={{ marginTop: '16px', padding: '10px 16px', background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.4)', borderRadius: '6px', color: '#fef2f2', fontWeight: '600', cursor: 'pointer', width: '100%' }}>
                        Approve Tier Assignment
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {viewMode === 'history' && (
            <div style={{ background: '#1e40af', backdropFilter: 'blur(16px)', border: '4px solid transparent', backgroundImage: 'linear-gradient(#1e40af, #1e40af), linear-gradient(135deg, #94a3b8 0%, #cbd5e1 50%, #94a3b8 100%)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', borderRadius: '4px', padding: '28px' }}>
              <h2 style={{ color: '#f1f5f9', fontSize: '22px', fontWeight: '700', marginBottom: '20px' }}>Credit Check History</h2>
              <div style={{ color: '#dbeafe', fontSize: '14px' }}>
                {mockCustomers.map(c => (
                  <div key={c.id} style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '6px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '600', color: '#f1f5f9' }}>{c.name}</div>
                      <div style={{ fontSize: '12px', color: '#cbd5e1' }}>Last checked: {c.lastCheck}</div>
                    </div>
                    <div style={{ background: c.currentTier === 'Platinum' ? '#1e40af' : c.currentTier === 'Sapphire' ? '#334155' : c.currentTier === 'Proforma' ? '#065f46' : c.currentTier === 'Crimson' ? '#7f1d1d' : '#475569', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>{c.currentTier}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
