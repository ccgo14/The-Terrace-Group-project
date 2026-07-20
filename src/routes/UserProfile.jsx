import { Link } from "react-router-dom";
import { Screen, Header, Button, KindLabel, MetaRow } from "../components/UI";
import BottomNav from "../components/BottomNav";
import { IconEdit } from "../components/Icons";
import { profile, articles } from "../data";

export default function Profile() {
  const posts = articles.filter((a) => a.kind === "FAN REACTION");
  const stats = [
    ["Posts", profile.stats.posts],
    ["Upvotes", profile.stats.upvotes],
    ["Followers", profile.stats.followers],
  ];

  return (
    <Screen>
      <Header
        title="Profile"
        right={
          <Link
            to="/post-article"
            className="text-night-pitch dark:text-floodlight block"
            aria-label="Post"
          >
            <IconEdit className="w-6 h-6" />
          </Link>
        }
      />

      <main className="pb-6">
        <div className="px-4 pt-6 flex items-start gap-4">
          <img
            src="/images/avatar.png"
            alt=""
            className="w-16 h-16 rounded-full object-cover bg-terracing/30 border border-terracing/40"
          />
          <div className="flex-1">
            <h2 className="font-display font-bold uppercase text-2xl leading-none text-night-pitch dark:text-floodlight">
              {profile.name}
            </h2>
            <p className="font-mono text-xs text-terracing mt-1">
              {profile.handle}
            </p>
          </div>
        </div>

        <p className="px-4 mt-3 text-sm leading-relaxed text-night-pitch dark:text-floodlight text-pretty">
          {profile.bio}
        </p>

        {/* stats — plain hard grid */}
        <div className="mx-4 mt-4 grid grid-cols-3 border border-terracing/40">
          {stats.map(([label, value], i) => (
            <div
              key={label}
              className={
                "py-3 text-center " +
                (i < 2 ? "border-r border-terracing/40" : "")
              }
            >
              <div className="font-mono font-bold text-xl text-night-pitch dark:text-floodlight tabular-nums">
                {value}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-terracing mt-0.5">
                {label}
              </div>
            </div>
          ))}
        </div>

        <div className="px-4 mt-4 flex gap-3">
          <Button variant="outline">Follow</Button>
          <Button variant="outline">Message</Button>
        </div>

        <h3 className="px-4 mt-8 mb-2 font-display font-bold uppercase text-lg tracking-wide text-night-pitch dark:text-floodlight">
          Posts
        </h3>
        <ul className="border-t border-terracing/30">
          {posts.map((a) => (
            <li key={a.id}>
              <Link
                to={`/articles/${a.id}`}
                className="block px-4 py-4 border-b border-terracing/30"
              >
                <KindLabel>{a.kind}</KindLabel>
                <p className="mt-2 font-display font-semibold uppercase leading-tight text-night-pitch dark:text-floodlight">
                  {a.title}
                </p>
                <div className="mt-2">
                  <MetaRow upvotes={a.upvotes} comments={a.comments} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>

      <BottomNav active="profile" />
    </Screen>
  );
}
