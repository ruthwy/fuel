# Fuel — your personal food tracker

Everything runs on-device. No server, no accounts. Data lives in your browser's local storage.

## Get it on your iPhone (one-time, ~3 min)

1. Create a free account at github.com if you don't have one.
2. Create a new **public** repository, e.g. `fuel`.
3. Upload all files in this folder (`index.html`, `app.js`, `sw.js`, `manifest.json`, `icon-192.png`, `icon-512.png`) — drag-drop on the repo page → Commit.
4. Repo → **Settings → Pages** → Source: `Deploy from a branch` → Branch: `main`, folder `/ (root)` → Save.
5. Wait ~1 min. Your app is at `https://<your-username>.github.io/fuel/`
6. Open that URL in **Safari on iPhone** → Share button → **Add to Home Screen**.

Now it launches like a native app, works offline, and all data stays on the phone.
(Phone and Mac keep separate data — use Export/Import in Profile to move it.)

## First run

Profile tab opens automatically → enter gender, age, height, weight, target weight + date, activity level → Save. Targets, water goal, and the weekly checkpoint are computed from this and **auto-adjust as your weight changes**.

## Daily use

- **Today**: tap a meal slot → **Use plan** (logs your predefined meal in one tap), or **+ Add food** for a custom entry, or **Skip**. Tap water glasses as you drink. Dashed glasses = extra water added because you had caffeine.
- Rice-type foods ask for **cooked weight**; dals, meats, oats etc. ask for **raw weight** — the input label always tells you which.
- Color dots: 🟢 good (protein/fiber dense) · 🟡 neutral · 🔴 limit (sugary / fatty-low-protein).
- **Trends**: log weight (2–3×/week is enough). Chart shows actual vs the target path; status tells you if you're on track. Calorie/protein bars for last 14 days.
- **Foods**: edit your default meal plan and the food database (add any food with its macros).
- **Coach**: paste an OpenAI API key (platform.openai.com → API keys) in the Coach tab. The key stays on your device only — never commit it to this repo (it's public; exposed keys get auto-revoked). The bot sees your targets, today's intake, remaining macros, and today's meal plan — ask it for meal-prep ideas, swaps, "what should I eat tonight", etc.

## Apple Health — reading data INTO the app (via Shortcuts)

Web apps can't access HealthKit directly, so an iPhone Shortcut named **Fuel Import** reads Health and hands the data over. Build it once:

1. **Shortcuts** app → **+** → rename it exactly `Fuel Import`.
2. Add actions in this order:
   1. **Find Health Samples** → type *Weight*, sorted by Start Date, Latest First, Limit 1
   2. **Set Variable** → name `w`
   3. **Find Health Samples** → type *Steps*, where Start Date *is today* → then **Calculate Statistics** → Sum → **Set Variable** `s`
   4. **Find Health Samples** → type *Active Energy*, where Start Date *is today* → **Calculate Statistics** → Sum → **Set Variable** `a`
   5. **Text** action containing exactly: `{"weightKg": w, "steps": s, "activeKcal": a}` (insert the variables where the letters are)
   6. **Copy to Clipboard**
   7. **Open URLs** → `https://ruthwy.github.io/fuel/`
3. Run it → app opens → tap **⬇︎ Import from Health** → allow the paste prompt.

The app then: auto-logs your weight, shows steps + active burn on Today, and adds extra water glasses on high-activity days (+1 per 500 active kcal).

**Optional — Health-driven calorie targets:** in Profile, enable *"Use Apple Health active energy for calorie targets"*. Your daily calorie budget is then computed from your real measured activity (BMR × 1.25 + active energy) instead of a fixed activity multiplier. Import daily if you use this.

Tip: add the Shortcut to your home screen or an automation (e.g. run every morning) so importing is one tap.

## Apple Health — writing data out (optional)

The **⬆︎ Export to Health** button copies today's numbers as JSON and runs a Shortcut named **Fuel Sync**. Build it once:

1. Open **Shortcuts** app → **+** new shortcut → rename it exactly `Fuel Sync`.
2. Add actions in this order:
   1. **Get Clipboard**
   2. **Get Dictionary from Input**
   3. **Get Dictionary Value** → key `kcal` → then **Log Health Sample** → type *Dietary Energy*, value: Dictionary Value, unit kcal
   4. **Get Dictionary Value** → key `protein` → **Log Health Sample** → *Protein*, unit g
   5. **Get Dictionary Value** → key `waterMl` → **Log Health Sample** → *Water*, unit mL
   6. (optional) **Get Dictionary Value** → key `weightKg` → **If** (has any value) → **Log Health Sample** → *Weight*, unit kg
3. Allow Health permissions when prompted the first time.

After that: one tap in the app → one tap "Run" → today's calories, protein, water (and weight if logged) land in Apple Health.

## Backup

Profile tab → Export backup (JSON). Import restores everything. Do this occasionally — clearing Safari website data wipes local storage.
