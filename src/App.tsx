import { useEffect, useMemo, useState } from 'react';
import { Activity, ChevronRight, Clock3, Dumbbell, Flame, HeartPulse, MapPin, Phone, ShieldCheck, Star, Users } from 'lucide-react';

type GymProfile = {
  id: number;
  name: string;
  tagline: string;
  description: string;
  location: string;
  phone: string;
  email: string;
  hours_weekdays: string;
  hours_weekend: string;
  hero_title: string;
  hero_subtitle: string;
  cta_primary: string;
  cta_secondary: string;
  price_monthly: number;
  joining_fee: number;
  trial_label: string;
};

type Facility = {
  id: number;
  title: string;
  description: string;
  icon: string;
};

type MembershipPlan = {
  id: number;
  name: string;
  duration_label: string;
  price: number;
  highlight: string;
  featured: boolean;
};

type Testimonial = {
  id: number;
  member_name: string;
  role: string;
  quote: string;
  rating: number;
};

type ClassItem = {
  id: number;
  name: string;
  coach: string;
  schedule: string;
  intensity: string;
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  dumbbell: Dumbbell,
  pulse: HeartPulse,
  shield: ShieldCheck,
  users: Users,
  flame: Flame,
  activity: Activity,
};

const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

function App() {
  const [profile, setProfile] = useState<GymProfile | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', phone: '', goal: 'Weight Training' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const fetchContent = async () => {
    try {
      const [profileRes, facilitiesRes, plansRes, testimonialsRes, classesRes] = await Promise.all([
        fetch('/api/gym-profile'),
        fetch('/api/facilities'),
        fetch('/api/membership-plans'),
        fetch('/api/testimonials'),
        fetch('/api/classes'),
      ]);

      const [profileData, facilitiesData, plansData, testimonialsData, classesData] = await Promise.all([
        profileRes.json(),
        facilitiesRes.json(),
        plansRes.json(),
        testimonialsRes.json(),
        classesRes.json(),
      ]);

      setProfile(profileData);
      setFacilities(facilitiesData);
      setPlans(plansData);
      setTestimonials(testimonialsData);
      setClasses(classesData);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const featuredPlan = useMemo(() => plans.find((plan) => plan.featured) ?? plans[0], [plans]);

  const submitLead = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Unable to submit');
      setMessage('Thanks! Our team will call you shortly to book your free tour.');
      setForm({ name: '', phone: '', goal: 'Weight Training' });
    } catch (error) {
      console.error('Submit error:', error);
      setMessage('Something went wrong. Please try again in a moment.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-lg text-neutral-300">
          <div className="h-3 w-3 rounded-full bg-lime-400 animate-pulse" />
          Loading gym experience...
        </div>
      </div>
    );
  }

  if (!profile) {
    return <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">Unable to load content.</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-neutral-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-lime-400">Elite Fitness Club</p>
            <h1 className="text-xl font-semibold">{profile.name}</h1>
          </div>
          <a href="#enquire" className="rounded-full bg-lime-400 px-5 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-lime-300">
            {profile.cta_primary}
          </a>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(163,230,53,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_28%)]" />
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:py-28">
            <div className="relative z-10">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-lime-400/30 bg-lime-400/10 px-4 py-2 text-sm text-lime-300">
                <MapPin className="h-4 w-4" />
                {profile.location}
              </div>
              <h2 className="max-w-3xl text-5xl font-black leading-tight tracking-tight md:text-6xl">
                {profile.hero_title}
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-300">
                {profile.hero_subtitle}
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <a href="#plans" className="inline-flex items-center gap-2 rounded-full bg-lime-400 px-6 py-3 font-semibold text-neutral-950 transition hover:bg-lime-300">
                  {profile.cta_secondary}
                  <ChevronRight className="h-4 w-4" />
                </a>
                <a href={`tel:${profile.phone}`} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-semibold text-white transition hover:border-white/30 hover:bg-white/5">
                  <Phone className="h-4 w-4" />
                  Call Now
                </a>
              </div>

              <div className="mt-12 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-neutral-400">Open Hours</p>
                  <p className="mt-2 font-semibold">{profile.hours_weekdays}</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-neutral-400">Starting From</p>
                  <p className="mt-2 font-semibold">{currency.format(profile.price_monthly)}/month</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-neutral-400">Offer</p>
                  <p className="mt-2 font-semibold">{profile.trial_label}</p>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-lime-950/30 backdrop-blur">
                <div className="rounded-[1.5rem] border border-lime-400/20 bg-neutral-900 p-6">
                  <p className="text-sm uppercase tracking-[0.3em] text-lime-400">Membership spotlight</p>
                  <h3 className="mt-4 text-3xl font-bold">{featuredPlan?.name}</h3>
                  <p className="mt-3 text-neutral-300">{featuredPlan?.highlight}</p>
                  <div className="mt-8 rounded-2xl bg-lime-400 p-5 text-neutral-950">
                    <p className="text-sm font-medium">Best value plan</p>
                    <p className="mt-2 text-4xl font-black">{featuredPlan ? currency.format(featuredPlan.price) : '--'}</p>
                    <p className="mt-1 text-sm">{featuredPlan?.duration_label}</p>
                  </div>
                  <div className="mt-6 space-y-3 text-sm text-neutral-300">
                    <div className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3">
                      <span>Joining Fee</span>
                      <span>{currency.format(profile.joining_fee)}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3">
                      <span>Personal Fitness Guidance</span>
                      <span>Included</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3">
                      <span>Free Tour</span>
                      <span>Available Daily</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-lime-400">About the club</p>
              <h3 className="mt-3 text-3xl font-bold">{profile.tagline}</h3>
              <p className="mt-5 max-w-3xl text-neutral-300">{profile.description}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-neutral-900/70 p-5">
                <Clock3 className="h-6 w-6 text-lime-400" />
                <p className="mt-4 text-sm text-neutral-400">Weekdays</p>
                <p className="mt-1 font-semibold">{profile.hours_weekdays}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-neutral-900/70 p-5">
                <Clock3 className="h-6 w-6 text-lime-400" />
                <p className="mt-4 text-sm text-neutral-400">Weekends</p>
                <p className="mt-1 font-semibold">{profile.hours_weekend}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14" id="facilities">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-lime-400">Facilities</p>
              <h3 className="mt-3 text-3xl font-bold">Train with premium equipment and expert support</h3>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {facilities.map((facility) => {
              const Icon = iconMap[facility.icon] ?? Dumbbell;
              return (
                <article key={facility.id} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-lime-400/40 hover:bg-white/7">
                  <div className="inline-flex rounded-2xl bg-lime-400/10 p-3 text-lime-400">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h4 className="mt-5 text-xl font-semibold">{facility.title}</h4>
                  <p className="mt-3 text-neutral-300">{facility.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14" id="plans">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-lime-400">Membership plans</p>
            <h3 className="mt-3 text-3xl font-bold">Simple pricing, serious results</h3>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.id}
                className={`rounded-[2rem] border p-7 ${plan.featured ? 'border-lime-400 bg-lime-400 text-neutral-950' : 'border-white/10 bg-white/5 text-white'}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-2xl font-bold">{plan.name}</h4>
                    <p className={`mt-2 text-sm ${plan.featured ? 'text-neutral-800' : 'text-neutral-400'}`}>{plan.duration_label}</p>
                  </div>
                  {plan.featured && <span className="rounded-full bg-neutral-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-lime-300">Popular</span>}
                </div>
                <p className="mt-8 text-4xl font-black">{currency.format(plan.price)}</p>
                <p className={`mt-4 ${plan.featured ? 'text-neutral-900' : 'text-neutral-300'}`}>{plan.highlight}</p>
                <a
                  href="#enquire"
                  className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 font-semibold transition ${plan.featured ? 'bg-neutral-950 text-white hover:bg-neutral-900' : 'bg-lime-400 text-neutral-950 hover:bg-lime-300'}`}
                >
                  Choose plan
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-lime-400">Group classes</p>
              <h3 className="mt-3 text-3xl font-bold">A weekly schedule that keeps you moving</h3>
              <p className="mt-4 text-neutral-300">From high-energy conditioning to mindful core sessions, each class is designed to help members stay consistent and challenged.</p>
            </div>
            <div className="space-y-4">
              {classes.map((classItem) => (
                <article key={classItem.id} className="grid gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-5 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <h4 className="text-xl font-semibold">{classItem.name}</h4>
                    <p className="mt-2 text-sm text-neutral-400">Coach {classItem.coach} • {classItem.schedule}</p>
                  </div>
                  <span className="rounded-full border border-lime-400/30 bg-lime-400/10 px-4 py-2 text-sm text-lime-300">{classItem.intensity}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-lime-400">Member voices</p>
            <h3 className="mt-3 text-3xl font-bold">Loved by people building stronger routines</h3>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article key={testimonial.id} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
                <div className="flex gap-1 text-lime-400">
                  {Array.from({ length: testimonial.rating }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-neutral-200">“{testimonial.quote}”</p>
                <div className="mt-6">
                  <p className="font-semibold">{testimonial.member_name}</p>
                  <p className="text-sm text-neutral-400">{testimonial.role}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14" id="enquire">
          <div className="grid gap-8 rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/8 to-white/3 p-8 lg:grid-cols-[0.95fr_1.05fr] lg:p-10">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-lime-400">Book your visit</p>
              <h3 className="mt-3 text-3xl font-bold">Claim your free gym tour and starter consultation</h3>
              <p className="mt-4 text-neutral-300">Tell us your goal and our team will help you choose the best plan, class schedule, and fitness path.</p>
              <div className="mt-8 space-y-4 text-sm text-neutral-300">
                <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-lime-400" /> {profile.location}</div>
                <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-lime-400" /> {profile.phone}</div>
                <div className="flex items-center gap-3"><Clock3 className="h-4 w-4 text-lime-400" /> {profile.hours_weekdays} weekdays</div>
              </div>
            </div>
            <form onSubmit={submitLead} className="grid gap-4 rounded-[1.5rem] border border-white/10 bg-neutral-950/80 p-6">
              <input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Your full name"
                required
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-lime-400"
              />
              <input
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="Phone number"
                required
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-lime-400"
              />
              <select
                value={form.goal}
                onChange={(e) => setForm((prev) => ({ ...prev, goal: e.target.value }))}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-lime-400"
              >
                <option>Weight Training</option>
                <option>Fat Loss</option>
                <option>Strength & Conditioning</option>
                <option>General Fitness</option>
              </select>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-lime-400 px-5 py-3 font-semibold text-neutral-950 transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? 'Submitting...' : 'Get a Free Tour'}
              </button>
              {message && <p className="text-sm text-neutral-300">{message}</p>}
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
