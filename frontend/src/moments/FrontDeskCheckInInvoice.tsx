import { useEffect, useState } from 'react';
import { Banknote, CircleCheck, CreditCard, DollarSign, FileText, Shield, User } from 'lucide-react';

type Phase = 'pending' | 'received';

type ClinicPayId = 'card' | 'cash' | 'check';

type FrontDeskCheckInInvoiceProps = {
  onCompleteCheckIn: () => void;
};

const COPAY = '$25.00';
const PLAN = 'Blue Cross Blue Shield';

/** Figma Make (`figma-make-moment3` imports): Spatial + Dashboard tokens. */
const SPATIAL_BG = '#f8fafc';
const PANEL_BORDER = 'rgba(0,9,50,0.12)';
const MUTED_LABEL = '#62748e';
const TEXT_PRIMARY = '#020617';
const TEXT_TITLE = '#0f172a';
const AMOUNT_COLOR = '#1c2024';
const COLLECT_ENABLED = '#3c43ee';
const VISA_FOCUS_RING = '#3e63dd';

/**
 * Moment3 right-pane check-in / invoice — styles from `figma-make-moment3` exports.
 */
export function FrontDeskCheckInInvoice({ onCompleteCheckIn }: FrontDeskCheckInInvoiceProps) {
  const [phase, setPhase] = useState<Phase>('pending');
  const [visaSavedSelected, setVisaSavedSelected] = useState(false);
  const [clinicMethod, setClinicMethod] = useState<ClinicPayId | null>(null);
  const [completeEnabled, setCompleteEnabled] = useState(false);

  useEffect(() => {
    if (phase !== 'received') {
      setCompleteEnabled(false);
      return;
    }
    const t = window.setTimeout(() => setCompleteEnabled(true), 5000);
    return () => window.clearTimeout(t);
  }, [phase]);

  const selectVisa = () => {
    setVisaSavedSelected(true);
    setClinicMethod(null);
  };

  const selectClinic = (id: ClinicPayId) => {
    setClinicMethod(id);
    setVisaSavedSelected(false);
  };

  const canCollect = visaSavedSelected && phase === 'pending';

  const handleCollect = () => {
    if (!canCollect) return;
    setPhase('received');
  };

  const clinicTile = (id: ClinicPayId, label: string, Icon: typeof CreditCard) => {
    const active = clinicMethod === id;
    return (
      <button
        key={id}
        type="button"
        onClick={() => selectClinic(id)}
        className={`flex min-h-0 flex-1 flex-col items-center justify-center gap-1 rounded-[12px] bg-white p-4 text-center transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3e63dd] ${
          active ? 'border-2 border-[#3e63dd]' : 'border border-[#e2e8f0] hover:border-[#cbd5e1]'
        }`}
      >
        <Icon className="size-8 text-[#64748b]" strokeWidth={1.25} aria-hidden />
        <span className="text-[18px] font-medium leading-6 tracking-[-0.04px] text-[#0f172a]">{label}</span>
      </button>
    );
  };

  const verifyIconWrap = (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#00bc7d] text-white">
      <User className="size-4" strokeWidth={1.33} aria-hidden />
    </div>
  );

  const verifyShieldWrap = (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#00bc7d] text-white">
      <Shield className="size-4" strokeWidth={1.33} aria-hidden />
    </div>
  );

  return (
    <div
      data-name="FrontDeskCheckInInvoice"
      className="flex h-full min-h-0 flex-col overflow-hidden font-['Inter',sans-serif]"
      style={{ backgroundColor: SPATIAL_BG }}
    >
      <div className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto p-5">
        <div
          className="relative flex w-full max-w-[1200px] flex-col gap-4 rounded-[12px] bg-white p-[21px] shadow-[0px_12px_32px_-16px_rgba(0,0,51,0.06),0px_8px_40px_0px_rgba(0,0,0,0.05)]"
          style={{ borderWidth: 1, borderStyle: 'solid', borderColor: PANEL_BORDER }}
        >
          {/* Hre — patient strip */}
          <header
            className="flex h-[54px] w-full shrink-0 items-center gap-3 rounded-[12px] bg-white px-0"
            data-name="PatientHeader"
          >
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[rgba(245,158,11,0.13)] text-[16px] font-light leading-6 text-[#a18072]"
              style={{
                backgroundImage:
                  'linear-gradient(145deg, rgba(245, 158, 11, 0.07) 6.17%, rgba(245, 158, 11, 0.03) 93.83%)',
              }}
              aria-hidden
            >
              SC
            </div>
            <h1 className="text-[16px] font-bold leading-6 text-[#0f172a]">Sarah Chen</h1>
          </header>

          {/* Identity */}
          <section
            className="flex w-full items-center gap-4 rounded-[14px] bg-[#f4fbf6] p-[17px]"
            style={{ borderWidth: 1, borderStyle: 'solid', borderColor: '#e8e8e8' }}
          >
            {verifyIconWrap}
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-medium leading-5 text-[#020617]">Identity Verified</p>
              <p className="mt-0.5 text-[12px] font-normal leading-4 tracking-[0.04px] text-[#64748b]">
                John Doe · DOB: 01/15/1985 · Right Shoulder
              </p>
            </div>
          </section>

          {/* Insurance */}
          <section
            className="flex w-full items-center gap-4 rounded-[14px] bg-[#f4fbf6] p-[17px]"
            style={{ borderWidth: 1, borderStyle: 'solid', borderColor: '#e8e8e8' }}
          >
            {verifyShieldWrap}
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-medium leading-5 text-[#020617]">Insurance Confirmed</p>
              <p className="mt-0.5 text-[12px] font-normal leading-4 tracking-[0.04px] text-[#64748b]">
                {PLAN} · BC123456789 — Approved — 12 visits
              </p>
            </div>
          </section>

          {phase === 'pending' ? (
            <section
              className="flex w-full flex-col items-end gap-4 rounded-[14px] p-[17px]"
              style={{
                backgroundColor: 'rgba(255, 0, 0, 0.01)',
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: '#e8e8e8',
              }}
            >
              <div className="flex w-full items-center gap-3.5">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#cea37e] text-white">
                  <DollarSign className="size-4" strokeWidth={1.25} aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[14px] font-medium leading-5 text-[#020617]">Collect Co-Pay</p>
                      <p className="text-[12px] font-normal leading-4 tracking-[0.04px] text-[#64748b]">
                        Awaiting pay from the patient
                      </p>
                    </div>
                    <div
                      className="shrink-0 rounded px-2 py-1"
                      style={{
                        backgroundColor: 'rgba(255, 0, 0, 0.03)',
                        borderWidth: 1,
                        borderStyle: 'solid',
                        borderColor: 'rgba(223, 0, 3, 0.34)',
                      }}
                    >
                      <span className="text-[12px] font-medium leading-4 tracking-[0.04px] text-[rgba(196,0,6,0.83)]">
                        Payment Pending
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="flex h-[70px] w-full items-center justify-between rounded-[8px] bg-white px-3 py-2"
                style={{ borderWidth: 1, borderStyle: 'solid', borderColor: '#cbd5e1' }}
              >
                <div>
                  <p className="text-[16px] font-bold leading-6 text-[#0f172a]">Co-pay due today</p>
                  <p className="text-[14px] font-normal leading-5 text-[#62748e]">{PLAN}</p>
                </div>
                <p className="text-[32px] font-bold leading-10 tracking-[-0.16px] text-[#1c2024]">{COPAY}</p>
              </div>

              <div className="flex w-full flex-col gap-4 py-4">
                <div className="flex w-full items-start justify-between gap-3 text-[14px] font-medium leading-5 text-[#62748e]">
                  <span>Select payment method</span>
                  <button type="button" className="shrink-0 whitespace-nowrap text-[#62748e] hover:underline">
                    Add payment method
                  </button>
                </div>

                <button
                  type="button"
                  onClick={selectVisa}
                  className="relative flex w-full items-center gap-4 rounded-[12px] bg-white px-4 py-3 text-left"
                  style={{
                    borderStyle: 'solid',
                    borderWidth: visaSavedSelected ? 2 : 1,
                    borderColor: visaSavedSelected ? VISA_FOCUS_RING : '#e2e8f0',
                  }}
                >
                  <div
                    className="relative flex h-6 w-[35px] shrink-0 items-center justify-center rounded border border-[#d9d9d9] bg-white"
                    aria-hidden
                  >
                    <span className="text-[9px] font-bold leading-none text-[#172b85]">VISA</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[16px] font-medium leading-6 text-[#0f172a]">Visa Card</p>
                    <p className="text-[12px] font-medium leading-[18px] tracking-[0.04px] text-[#62748e]">Ending in 4242</p>
                  </div>
                </button>

                <p className="text-[14px] font-medium leading-5 text-[#62748e]">Other payment methods (Payable at Clinic)</p>

                <div className="flex w-full gap-4">
                  {clinicTile('card', 'Card', CreditCard)}
                  {clinicTile('cash', 'Cash', Banknote)}
                  {clinicTile('check', 'Check', FileText)}
                </div>
              </div>

              <button
                type="button"
                disabled={!canCollect}
                onClick={handleCollect}
                className="flex h-8 shrink-0 items-center justify-center rounded px-3 text-[14px] font-medium leading-5 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3e63dd] disabled:cursor-not-allowed"
                style={
                  canCollect
                    ? { backgroundColor: COLLECT_ENABLED, color: '#fff' }
                    : { backgroundColor: 'rgba(0,0,51,0.06)', color: 'rgba(0,8,48,0.27)' }
                }
              >
                Collect {COPAY}
              </button>
            </section>
          ) : (
            <>
              <section
                className="flex w-full flex-col gap-4 rounded-[14px] bg-[#f4fbf6] p-[17px]"
                style={{ borderWidth: 1, borderStyle: 'solid', borderColor: '#e8e8e8' }}
              >
                <div className="flex w-full items-center gap-3.5">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#30a46c] text-white">
                    <DollarSign className="size-4" strokeWidth={1.25} aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[14px] font-medium leading-5 text-[#020617]">Collect Co-Pay</p>
                        <p className="text-[12px] font-normal leading-4 tracking-[0.04px] text-[#64748b]">
                          Co-pay of $25 Received from Sarah
                        </p>
                      </div>
                      <div
                        className="shrink-0 rounded px-2 py-1"
                        style={{
                          backgroundColor: 'rgba(0, 163, 47, 0.04)',
                          borderWidth: 1,
                          borderStyle: 'solid',
                          borderColor: 'rgba(0, 145, 64, 0.44)',
                        }}
                      >
                        <span className="text-[12px] font-medium leading-4 tracking-[0.04px] text-[rgba(0,113,63,0.87)]">
                          Payment Received
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="w-full rounded-[12px] bg-[#f9f9f9] px-5 py-2"
                  style={{ borderWidth: 1, borderStyle: 'solid', borderColor: '#cbd5e1' }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-2">
                      <CircleCheck className="size-6 shrink-0 text-[#2b9a66]" strokeWidth={1.25} aria-hidden />
                      <p className="pt-0.5 text-[16px] font-bold leading-6 text-[#0f172a]">Amount Received</p>
                    </div>
                    <p className="text-[32px] font-bold leading-10 tracking-[-0.16px] text-[#1c2024]">{COPAY}</p>
                  </div>
                  <div className="my-2 h-px w-full bg-[#e2e8f0]" />
                  <div className="grid grid-cols-1 gap-4 pb-5 pl-[30px] pr-5 pt-2.5 sm:grid-cols-2">
                    <div>
                      <p className="text-[12px] font-normal uppercase leading-4 tracking-[0.04px] text-[#64748b]">
                        Transaction ID
                      </p>
                      <p className="mt-1 text-[16px] font-medium leading-6 text-[#020617]">ETH-98234-XLY</p>
                    </div>
                    <div>
                      <p className="text-[12px] font-normal uppercase leading-4 tracking-[0.04px] text-[#64748b]">
                        Date & Time
                      </p>
                      <p className="mt-1 text-[16px] font-medium leading-6 text-[#020617]">Apr 16, 2026 · 09:00 AM</p>
                    </div>
                    <div>
                      <p className="text-[12px] font-normal uppercase leading-4 tracking-[0.04px] text-[#64748b]">
                        Payment Method
                      </p>
                      <p className="mt-1 flex items-center gap-2 text-[16px] font-medium leading-6 text-[#020617]">
                        <CreditCard className="size-4 text-[#3a6095]" strokeWidth={1.25} aria-hidden />
                        Visa ending in 4242
                      </p>
                    </div>
                    <div>
                      <p className="text-[12px] font-normal uppercase leading-4 tracking-[0.04px] text-[#64748b]">Account</p>
                      <p className="mt-1 text-[16px] font-medium leading-6 text-[#020617]">Sarah Chen (ID: 4402)</p>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          <div className="flex w-full justify-end">
            <button
              type="button"
              disabled={phase !== 'received' || !completeEnabled}
              onClick={onCompleteCheckIn}
              className="inline-flex h-10 shrink-0 items-center justify-center rounded-[6px] px-5 text-[16px] font-medium leading-6 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3e63dd] disabled:cursor-not-allowed"
              style={
                phase === 'received' && completeEnabled
                  ? { backgroundColor: COLLECT_ENABLED, color: '#fff' }
                  : { backgroundColor: 'rgba(0,0,51,0.06)', color: 'rgba(0,8,48,0.27)' }
              }
            >
              Complete Checkin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
