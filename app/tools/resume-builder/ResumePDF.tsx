import { Document, Page, Text, View, Link, StyleSheet, Svg, Path, Circle, Rect } from "@react-pdf/renderer";

const FONT = "Crimson Pro";

const styles = StyleSheet.create({
  page: {
    padding: "16.51mm",
    fontFamily: FONT,
    fontSize: 10,
    lineHeight: 1.15,
    color: "#1f2937",
  },
  header: { textAlign: "center" },
  name: { fontSize: 25, fontWeight: 700, letterSpacing: 1 },
  gap1: { height: 18 },
  designation: { fontSize: 11, color: "#374151" },
  gap2: { height: 7 },
  contactRow: { flexDirection: "row", justifyContent: "center", flexWrap: "wrap", fontSize: 8, color: "#4b5563" },
  contactItem: { flexDirection: "row", alignItems: "center", marginHorizontal: 4 },
  overview: { fontSize: 9.5, lineHeight: 1.2, color: "#374151" },
  sectionTitle: {
    fontSize: 13.5,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1,
    borderBottom: "0.5px solid #d1d5db",
    paddingBottom: 6,
    marginTop: 16,
    marginBottom: 6,
  },
  expBlock: { marginBottom: 6 },
  expHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  expTitle: { fontSize: 10, fontWeight: 700 },
  expStatus: { fontSize: 10, fontWeight: 700 },
  expMeta: { fontSize: 9, fontStyle: "italic", color: "#4b5563", marginTop: 1 },
  bulletList: { marginTop: 3 },
  bulletRow: { flexDirection: "row", marginBottom: 1, fontSize: 9.5, lineHeight: 1.2 },
  bullet: { width: 10, textAlign: "center" as const },
  bulletText: { flex: 1, color: "#374151" },
  skillRow: { fontSize: 9.5, lineHeight: 1.4, marginBottom: 1, color: "#374151" },
  skillLabel: { fontWeight: 700, color: "#1f2937" },
  eduBlock: { marginBottom: 6 },
  eduHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  eduCourse: { fontSize: 10, fontWeight: 700 },
  eduDates: { fontSize: 10, fontWeight: 700 },
  eduMeta: { fontSize: 9, fontStyle: "italic", color: "#4b5563" },
  actBlock: { marginBottom: 6 },
  actHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  actTitle: { fontSize: 10, fontWeight: 700 },
  actDuration: { fontSize: 9, fontStyle: "italic", color: "#4b5563" },
  actOrg: { fontSize: 9, fontStyle: "italic", color: "#4b5563", marginTop: 1 },
  actDesc: { fontSize: 9.5, lineHeight: 1.2, color: "#374151", marginTop: 1 },
  achRow: { flexDirection: "row", marginBottom: 3, fontSize: 9.5, lineHeight: 1.2 },
  achBullet: { width: 10, textAlign: "center" as const },
  achText: { flex: 1, color: "#374151" },
  achResult: { fontWeight: 700, color: "#1f2937" },
  refBlock: { marginBottom: 6 },
  refName: { fontSize: 10, fontWeight: 700 },
  refDetails: { fontSize: 9, fontStyle: "italic", color: "#4b5563" },
  refContact: { fontSize: 9, color: "#6b7280", marginTop: 1 },
});

function formatDate(ym: string) {
  if (!ym) return "";
  const [y, m] = ym.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[parseInt(m, 10) - 1] || m} ${y}`;
}

function normalizeUrl(url: string) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
}

function githubDisplay(url: string) {
  const clean = url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  const parts = clean.split("/");
  const user = parts[parts.length - 1] || url;
  return `github.com/${user}`;
}

function linkedinDisplay(url: string) {
  const clean = url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  const match = clean.match(/(?:in\/)?(.+)/);
  const user = match ? match[1] : url;
  return `in/${user}`;
}

function portfolioDisplay(url: string, show?: string) {
  if (show) return show;
  const clean = url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  return clean;
}

export type ResumeData = {
  fullName: string;
  designation: string;
  phone: string;
  email: string;
  github: string;
  githubShow: string;
  linkedin: string;
  linkedinShow: string;
  portfolio: string;
  portfolioShow: string;
  overview: string;
  projects: { id: string; title: string; bulletPoints: string[]; status: string; liveUrl: string; tools: string }[];
  experiences: { id: string; designation: string; company: string; bulletPoints: string[]; status: string; startDate: string; endDate: string }[];
  skillGroups: { id: string; title: string; skills: string }[];
  education: { id: string; course: string; institution: string; startDate: string; endDate: string; result: string }[];
  activities: { id: string; title: string; organization: string; duration: string; description: string }[];
  achievements: { id: string; result: string; description: string }[];
  references: { id: string; name: string; designation: string; company: string; phone: string; email: string }[];
};

function ContactBadge({ children }: { children: React.ReactNode }) {
  return <View style={styles.contactItem}>{children}</View>;
}

function PhoneIcon() {
  return (
    <Svg width={7} height={7} viewBox="0 0 24 24" stroke="#4b5563" strokeWidth={2}>
      <Path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
    </Svg>
  );
}

function MailIcon() {
  return (
    <Svg width={7} height={7} viewBox="0 0 24 24" stroke="#4b5563" strokeWidth={2}>
      <Rect x={2} y={4} width={20} height={16} rx={2} />
      <Path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
    </Svg>
  );
}

function GitHubIcon() {
  return (
    <Svg width={7} height={7} viewBox="0 0 16 16" fill="#4b5563">
      <Path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
    </Svg>
  );
}

function LinkedInIcon() {
  return (
    <Svg width={7} height={7} viewBox="0 0 16 16" fill="#4b5563">
      <Path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
    </Svg>
  );
}

function GlobeIcon() {
  return (
    <Svg width={7} height={7} viewBox="0 0 24 24" stroke="#4b5563" strokeWidth={2}>
      <Circle cx={12} cy={12} r={10} />
      <Path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <Path d="M2 12h20" />
    </Svg>
  );
}

export default function ResumePDF({ data }: { data: ResumeData }) {
  const h = (arr: any[]) => arr.some((item) =>
    Object.entries(item).some(([k, v]) => {
      if (k === "id") return false;
      if (typeof v === "string" && v.trim() !== "") return true;
      if (Array.isArray(v) && v.some((x: any) => typeof x === "string" && x.trim() !== "")) return true;
      return false;
    })
  );

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{data.fullName.toUpperCase()}</Text>
          <View style={styles.gap1} />
          <Text style={styles.designation}>{data.designation.toUpperCase()}</Text>
          <View style={styles.gap2} />
          <View style={styles.contactRow}>
            {data.phone && (
              <ContactBadge>
                <PhoneIcon />
                <Text style={{ color: "#4b5563", marginLeft: 2 }}>{data.phone}</Text>
              </ContactBadge>
            )}
            {data.email && (
              <ContactBadge>
                <MailIcon />
                <Link src={`mailto:${data.email}`} style={{ color: "#4b5563", marginLeft: 2, textDecoration: "none" }}>{data.email}</Link>
              </ContactBadge>
            )}
            {data.github && (
              <ContactBadge>
                <GitHubIcon />
                <Link src={normalizeUrl(data.github)} style={{ color: "#4b5563", marginLeft: 2, textDecoration: "none" }}>{data.githubShow || githubDisplay(data.github)}</Link>
              </ContactBadge>
            )}
            {data.linkedin && (
              <ContactBadge>
                <LinkedInIcon />
                <Link src={normalizeUrl(data.linkedin)} style={{ color: "#4b5563", marginLeft: 2, textDecoration: "none" }}>{data.linkedinShow || linkedinDisplay(data.linkedin)}</Link>
              </ContactBadge>
            )}
            {data.portfolio && (
              <ContactBadge>
                <GlobeIcon />
                <Link src={normalizeUrl(data.portfolio)} style={{ color: "#4b5563", marginLeft: 2, textDecoration: "none" }}>{data.portfolioShow || portfolioDisplay(data.portfolio)}</Link>
              </ContactBadge>
            )}
          </View>
        </View>

        <View style={{ height: 15 }} />

        {data.overview.trim() && (
          <>
            <Text style={styles.overview}>{data.overview}</Text>
            <View style={{ height: 5 }} />
          </>
        )}

        {h(data.projects) && (
          <>
            <Text style={styles.sectionTitle}>PROJECTS</Text>
            {data.projects.filter((p) => p.title.trim()).map((p, i) => (
              <View key={i} style={styles.expBlock}>
                <View style={styles.expHeaderRow}>
                  <Text style={styles.expTitle}>{p.title}</Text>
                  <Text style={styles.expStatus}>{p.status}</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  {p.liveUrl && (
                    <Text style={[styles.expMeta, { flex: 1 }]}>
                      <Link src={normalizeUrl(p.liveUrl)} style={{ textDecoration: "none", color: "#4b5563" }}>{portfolioDisplay(p.liveUrl)}</Link>
                    </Text>
                  )}
                  {p.tools && (
                    <Text style={[styles.expMeta, { textAlign: "right", flex: 1 }]}>{p.tools}</Text>
                  )}
                </View>
                {p.bulletPoints.filter(Boolean).length > 0 && (
                  <View style={styles.bulletList}>
                    {p.bulletPoints.filter(Boolean).map((bp, j) => (
                      <View key={j} style={styles.bulletRow}>
                        <Text style={styles.bullet}>- </Text>
                        <Text style={styles.bulletText}>{bp}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </>
        )}

        {h(data.experiences) && (
          <>
            <Text style={styles.sectionTitle}>EXPERIENCE</Text>
            {data.experiences.filter((e) => e.designation.trim()).map((exp, i) => (
              <View key={i} style={styles.expBlock}>
                <View style={styles.expHeaderRow}>
                  <Text style={styles.expTitle}>{exp.designation}</Text>
                  <Text style={styles.expStatus}>{exp.status}</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  {exp.company && <Text style={styles.expMeta}>{exp.company}</Text>}
                  {(exp.startDate || exp.endDate) && (
                    <Text style={[styles.expMeta, { textAlign: "right" }]}>
                      {[formatDate(exp.startDate), formatDate(exp.endDate)].filter(Boolean).join(" – ")}
                    </Text>
                  )}
                </View>
                {exp.bulletPoints.filter(Boolean).length > 0 && (
                  <View style={styles.bulletList}>
                    {exp.bulletPoints.filter(Boolean).map((bp, j) => (
                      <View key={j} style={styles.bulletRow}>
                        <Text style={styles.bullet}>- </Text>
                        <Text style={styles.bulletText}>{bp}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </>
        )}

        {h(data.skillGroups) && (
          <>
            <Text style={styles.sectionTitle}>TECHNICAL SKILLS</Text>
            {data.skillGroups.filter((s) => s.title.trim()).map((sg, i) => (
              <Text key={i} style={styles.skillRow}>
                <Text style={styles.skillLabel}>{sg.title}: </Text>
                {sg.skills}
              </Text>
            ))}
          </>
        )}

        {h(data.education) && (
          <>
            <Text style={styles.sectionTitle}>EDUCATION</Text>
            {data.education.filter((e) => e.course.trim()).map((edu, i) => (
              <View key={i} style={styles.eduBlock}>
                <View style={styles.eduHeaderRow}>
                  <Text style={styles.eduCourse}>{edu.course}</Text>
                  <Text style={styles.eduDates}>{[formatDate(edu.startDate), formatDate(edu.endDate)].filter(Boolean).join(" – ")}</Text>
                </View>
                <Text style={styles.eduMeta}>{edu.institution}</Text>
                {edu.result && <Text style={styles.eduMeta}>{edu.result}</Text>}
              </View>
            ))}
          </>
        )}

        {h(data.activities) && (
          <>
            <Text style={styles.sectionTitle}>EXTRACURRICULAR ACTIVITIES</Text>
            {data.activities.filter((a) => a.title.trim()).map((act, i) => (
              <View key={i} style={styles.actBlock}>
                <View style={styles.actHeaderRow}>
                  <Text style={styles.actTitle}>{act.title}</Text>
                  {act.duration && <Text style={styles.actDuration}>{act.duration}</Text>}
                </View>
                {act.organization && <Text style={styles.actOrg}>{act.organization}</Text>}
                {act.description && <Text style={styles.actDesc}>{act.description}</Text>}
              </View>
            ))}
          </>
        )}

        {h(data.achievements) && (
          <>
            <Text style={styles.sectionTitle}>ACHIEVEMENTS</Text>
            {data.achievements.filter((a) => a.result.trim() || a.description.trim()).map((ach, i) => (
              <View key={i} style={styles.achRow}>
                <Text style={styles.achBullet}>- </Text>
                <Text style={styles.achText}>
                  <Text style={styles.achResult}>{ach.result}</Text>
                  {ach.description ? ` – ${ach.description}` : ""}
                </Text>
              </View>
            ))}
          </>
        )}

        {h(data.references) && (
          <>
            <Text style={styles.sectionTitle}>REFERENCES</Text>
            {data.references.filter((r) => r.name.trim()).map((ref, i) => (
              <View key={i} style={styles.refBlock}>
                <Text style={styles.refName}>{ref.name}</Text>
                <Text style={styles.refDetails}>{[ref.designation, ref.company].filter(Boolean).join(", ")}</Text>
                <Text style={styles.refContact}>{[ref.phone, ref.email].filter(Boolean).join(" | ")}</Text>
              </View>
            ))}
          </>
        )}
      </Page>
    </Document>
  );
}
