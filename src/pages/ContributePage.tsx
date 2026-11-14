import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Compass,
  Handshake,
  Landmark,
  Mail,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { DatasetItem, PageRoute } from '../types/hub';

interface ContributePageProps {
  contributedDatasets?: DatasetItem[];
  onContributionCreated?: (dataset: DatasetItem) => void;
  onSelectDataset?: (datasetId: string) => void;
  onNavigate: (page: PageRoute) => void;
}

interface PartnerGroup {
  id: 'government' | 'businesses' | 'communities' | 'visitors';
  roleLabel: string;
  title: string;
  audience: string;
  summary: string;
  whatYouGive: string[];
  whatYouGet: string[];
  preferredFormats: string;
  accessModel: string;
}

const PARTNER_GROUPS: PartnerGroup[] = [
  {
    id: 'government',
    roleLabel: 'Public Sector & Authorities',
    title: 'Government & Public Agencies',
    audience:
      'District offices, sub-district municipalities (Tambon), national park rangers, and provincial tourism authorities.',
    summary:
      'Establish one authoritative civic reference for border checkpoint volume, park access notices, and public transit timetables across Mae Sai.',
    whatYouGive: [
      'Monthly visitor checkpoint counts and seasonal trail advisories',
      'Official public songthaew routes, park hours, and emergency notices',
      'Anonymized planning summaries and restricted governance metadata',
    ],
    whatYouGet: [
      'One verified public reference reducing repetitive traveler inquiries',
      'Early visibility into peak-hour crowding across Pong Pha and Doi Wao',
      'Structured visitor feedback aggregated by sub-district and season',
    ],
    preferredFormats: 'CSV tables, seasonal status logs, metadata schemas',
    accessModel: 'Open or Restricted (Metadata only)',
  },
  {
    id: 'businesses',
    roleLabel: 'Hospitality & Local Commerce',
    title: 'Local Businesses & Operators',
    audience:
      'Highland cafés, coffee roasteries, homestays, local eateries, artisan shops, and bicycle or transport cooperatives.',
    summary:
      'Keep your opening hours, seasonal closures, and payment options accurate across connected travel directories and local route guides.',
    whatYouGive: [
      'Confirmed opening hours, weekly closing days, and seasonal schedules',
      'Accepted payment options (Thai QR, cash, international card) & languages',
      'Afternoon capacity windows, workshops, and local product provenance',
    ],
    whatYouGet: [
      'Verified visibility inside Explore Mae Sai and connected partner apps',
      'Seasonal demand forecasts to plan staffing, roasting, and inventory',
      'More afternoon visitors routed away from congested 09:00–11:00 peaks',
    ],
    preferredFormats: 'Directory profiles, schedule sheets, JSON feeds',
    accessModel: 'Open public directory with attributed source',
  },
  {
    id: 'communities',
    roleLabel: 'Associations & Village Networks',
    title: 'Communities & Local Associations',
    audience:
      'Ethnic heritage collectives, village tourism enterprises, craft cooperatives, youth groups, and temple or festival committees.',
    summary:
      'Share cultural calendars and community-led routes on your own terms—preserving attribution while bringing sustainable travel beyond the main highway.',
    whatYouGive: [
      'Local festival dates, craft fair calendars, and village workshop details',
      'Community-approved walking, cycling, and heritage trail descriptions',
      'Attributed local photography, oral histories, and seasonal harvest notes',
    ],
    whatYouGet: [
      'Protected community attribution and control over sensitive records',
      'Direct visitor discovery for outlying areas like Ko Chang and Ban Pang Ha',
      'Shared analytics to support local grant proposals and tourism planning',
    ],
    preferredFormats: 'Event calendars, attributed media, bilingual route notes',
    accessModel: 'Open or Members only for association drafts',
  },
  {
    id: 'visitors',
    roleLabel: 'Travelers & Field Contributors',
    title: 'Visitors & Independent Researchers',
    audience:
      'Domestic travelers, slow-travel cyclists, researchers, and travel storytellers documenting northern Thailand.',
    summary:
      'Turn on-the-ground observations about signage, road conditions, and local hospitality into practical improvements for the entire district.',
    whatYouGive: [
      'Practical notes on missing directional signs, transit stops, or closures',
      'Language and payment accessibility observations across sub-districts',
      'Attributed landmark photography and indexed field notes',
    ],
    whatYouGet: [
      'Reliable, timestamped local guidance verified by Mae Sai hosts',
      'Transparent seasonal planning insights before driving steep hill roads',
      'Public credit as a field contributor in the Mae Sai knowledge archive',
    ],
    preferredFormats: 'Structured field notes, attributed photos, observation logs',
    accessModel: 'Open anonymized feedback (PDPA-compliant)',
  },
];

const EXTERNAL_BENEFITS = [
  {
    title: 'Mutual Data Exchange',
    description:
      'Organizations retain ownership of their source records while gaining access to district-wide seasonal trends and visitor insights.',
  },
  {
    title: 'Clear Attribution & Governance',
    description:
      'Every dataset credits its contributing association or office and enforces Open, Members only, or Restricted access tiers.',
  },
  {
    title: 'Connect Across Sub-Districts',
    description:
      'Link municipal authorities, Ko Chang craft cooperatives, Pong Pha trail stewards, and Wiang Phang Kham businesses in one shared standard.',
  },
];

export function ContributePage({ onNavigate }: ContributePageProps) {
  const groupIcons: Record<PartnerGroup['id'], typeof Landmark> = {
    government: Landmark,
    businesses: Building2,
    communities: Users,
    visitors: Compass,
  };

  return (
    <div className="bg-[#F7F8F5]">
      {/* Editorial Partnership Invitation Banner */}
      <section className="bg-[#243329] text-white border-b border-[#406246]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#f5f0de]">
              <Handshake className="w-4 h-4" aria-hidden="true" />
              <span>Community &amp; Organizational Partnership</span>
            </div>

            <h1 className="font-editorial text-3xl sm:text-4xl lg:text-[46px] font-bold text-white leading-[1.12] tracking-tight">
              Partner with Together Mae Sai
            </h1>

            <p className="text-base sm:text-lg text-[#D7E2DA] leading-relaxed">
              An open invitation to government offices, local associations, community enterprises, businesses, and travelers to connect and exchange trusted Mae Sai tourism data.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-12 space-y-12">
        {/* Why Connect Strip */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {EXTERNAL_BENEFITS.map((benefit) => (
            <div
              key={benefit.title}
              className="bg-white border border-[#E3E6DF] rounded-xl p-5 space-y-2"
            >
              <div className="flex items-center gap-2 text-sm font-bold text-[#406246]">
                <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{benefit.title}</span>
              </div>
              <p className="text-sm text-[#66736A] leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </section>

        {/* Four Stakeholder Exchange Cards ("What you give" / "What you get") */}
        <section className="space-y-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#406246]">
              Value Exchange Framework
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#243329]">
              How each group participates
            </h2>
            <p className="text-sm text-[#66736A]">
              Every partner contributes practical local knowledge and receives clear operational value in return.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {PARTNER_GROUPS.map((group) => {
              const Icon = groupIcons[group.id];
              return (
                <article
                  key={group.id}
                  className="bg-white border border-[#E3E6DF] rounded-2xl overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Card Header */}
                    <div className="bg-[#f5f0de] border-b border-[#E2D9BA] px-6 py-5 flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#406246]">
                          {group.roleLabel}
                        </div>
                        <h3 className="font-editorial text-xl font-bold text-[#243329]">
                          {group.title}
                        </h3>
                        <p className="text-xs text-[#556259] leading-relaxed">
                          {group.audience}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-[#406246] text-white flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" aria-hidden="true" />
                      </div>
                    </div>

                    {/* Overview + Two-Column Give / Get */}
                    <div className="p-6 space-y-5">
                      <p className="text-sm text-[#3D4B41] leading-relaxed">
                        {group.summary}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-[#F7F8F5] border border-[#E3E6DF] rounded-xl p-4 space-y-2.5">
                          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#406246]">
                            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>What you give</span>
                          </div>
                          <ul className="space-y-2 text-xs text-[#243329] leading-relaxed">
                            {group.whatYouGive.map((item) => (
                              <li key={item} className="flex items-start gap-2">
                                <span
                                  className="w-1.5 h-1.5 rounded-full bg-[#406246] shrink-0 mt-1.5"
                                  aria-hidden="true"
                                />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-[#FAF7ED] border border-[#E2D9BA] rounded-xl p-4 space-y-2.5">
                          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#243329]">
                            <ArrowDownLeft className="w-3.5 h-3.5 text-[#406246]" aria-hidden="true" />
                            <span>What you get</span>
                          </div>
                          <ul className="space-y-2 text-xs text-[#243329] leading-relaxed">
                            {group.whatYouGet.map((item) => (
                              <li key={item} className="flex items-start gap-2">
                                <span
                                  className="w-1.5 h-1.5 rounded-full bg-[#243329] shrink-0 mt-1.5"
                                  aria-hidden="true"
                                />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Metadata */}
                  <div className="px-6 py-3.5 bg-[#F7F8F5] border-t border-[#ECEFE9] flex flex-wrap items-center justify-between gap-2 text-xs text-[#66736A]">
                    <span>
                      <strong className="text-[#243329]">Formats:</strong>{' '}
                      {group.preferredFormats}
                    </span>
                    <span className="font-medium text-[#406246]">
                      {group.accessModel}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* External Association Connection Notice */}
        <section className="bg-white border border-[#E3E6DF] rounded-2xl p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#406246]">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                <span>Connect With Our Coordination Network</span>
              </div>
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#243329]">
                Represent a community, association, or municipal office?
              </h2>
              <p className="text-sm sm:text-base text-[#556259] leading-relaxed max-w-2xl">
                Together Mae Sai welcomes tourism associations, highland coffee collectives, municipal agencies, and research teams across Chiang Rai to link directories, synchronize seasonal advisories, or co-publish open datasets under PDPA-aligned governance.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#243329]">
                <div className="inline-flex items-center gap-2 bg-[#F7F8F5] border border-[#E3E6DF] rounded-lg px-3.5 py-2">
                  <Mail className="w-4 h-4 text-[#406246]" aria-hidden="true" />
                  <span className="font-mono text-xs">
                    partners@togethermaesai.org
                  </span>
                </div>
                <span className="text-[#66736A]">
                  Data Exchange Endpoint:{' '}
                  <code className="font-mono text-xs text-[#243329]">
                    POST /api/contributions
                  </code>
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-[#f5f0de] border border-[#E2D9BA] rounded-xl p-5 space-y-3">
              <div className="text-xs font-semibold text-[#406246]">
                Explore What Partners Publish
              </div>
              <p className="text-xs text-[#243329] leading-relaxed">
                Preview how existing district datasets, governance tiers, and verified local places are presented before sharing your organization&apos;s records.
              </p>
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => onNavigate('catalog')}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#406246] hover:bg-[#335038] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <span>Browse Data Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('explore-map')}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-[#F7F8F5] text-[#243329] border border-[#D7DDD3] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <span>View Explore Mae Sai</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
