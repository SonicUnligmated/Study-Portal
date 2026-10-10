# Chapter 3 — Fluid Flow (mass flow & continuity)

## 1. Overview & learning map

| Topic | Core idea |
|-------|-----------|
| Fluid (flow context) | Continuously changes shape under force; liquids & gases |
| Laminar vs turbulent | Smooth parallel layers vs swirling chaos |
| Mass flow rate | ρ A v |
| Volume flow rate Q | A v |
| Continuity | ρ₁A₁v₁ = ρ₂A₂v₂; for blood ≈ A₁v₁ = A₂v₂ |
| Medical | Stenosis (faster flow), turbulence, murmurs |

---

## 2. What is a fluid?

A fluid can **flow** and **continuously change shape** under an external force. Fluids cannot resist static shear the way solids do.

| Liquids | Gases |
|---------|-------|
| Blood, lymph, plasma | O₂, CO₂, air in the respiratory system |

---

## 3. Types of fluid flow

### Streamline (laminar)

- Smooth, orderly flow  
- Fluid moves in **parallel layers**  
- In vessels: **highest velocity in the centre**, lowest near the wall  
- Velocity profile ≈ **parabolic**  
- Normal flow in **healthy arteries**

### Turbulent

- Above a certain speed (or with irregularities): **wild swirl**  
- Layers mix radially and axially  
- Increases **energy loss** and **resistance**  
- Can reduce tissue perfusion; may produce **murmurs**  
- Triggers: high velocity, vessel irregularity, or a sudden narrowing

### Medical examples

| Situation | Flow type |
|-----------|-----------|
| Healthy artery | Laminar |
| Narrowed artery (stenosis) | Often turbulent |
| Diseased heart valve | Turbulence → audible murmurs |

**Why it matters:** Laminar flow spends energy pushing blood forward. Turbulence wastes energy in sideways motion → poorer perfusion and audible noise.

---

## 4. Mass flow rate & volume flow rate

### Mass flow rate

Amount of **mass** passing a point per unit time.

```
Mass flow rate = m / t
Since m = ρ V and V = A × ℓ:
Mass flow rate = ρ A (ℓ / t) = ρ A v
```

**How mass flow rate is assembled:**
- Start from definition: mass passing a cross-section per time → m/t.
- Mass of a fluid slug is density × volume: m = ρV.
- That volume is the tube’s cross-section times how far the fluid moves: V = A × ℓ.
- Distance per time is speed: ℓ/t = v.
- Combine: mass flow rate = ρ A v. Symbols: ρ = density, A = cross-sectional area, v = speed.

Unit check: (kg/m³)·(m²)·(m/s) = **kg/s**.

> **Note:** mass flow rate ṁ may also be written as **Q**, as in the slides: Q = ρAv.

### Volume flow rate

```
Q = A v
```

**How volume flow rate is assembled (separate from mass flow):** Q is volume per time. A fluid slug of cross-section A advancing at speed v sweeps volume A×v each second — so Q = A v. No density here: this tracks space occupied, not mass. Unit: **m³/s**.

Often both use the symbol Q — check whether mass or volume is meant from context (ρAv vs Av).

---

## 5. Equation of continuity

### Statement

If no fluid is added or removed between two sections of a tube, **flow rate is conserved**.

```
General:     ρ₁ A₁ v₁ = ρ₂ A₂ v₂
Incompressible (liquids / blood ≈ constant ρ):
             A₁ v₁ = A₂ v₂
```

**How the general continuity equation is made:** mass is conserved — whatever mass enters section 1 per second must leave section 2 per second (no leaks, no sources). Mass flow at a section is ρAv, so set ρ₁A₁v₁ = ρ₂A₂v₂. This form keeps density free to differ between sections (e.g. a compressible gas).

**How the incompressible form is made (separate variant):** when density is the same at both sections (liquids; blood ≈ constant ρ), ρ cancels and you are left with A₁v₁ = A₂v₂ — volume flow rate is conserved. Narrower A means larger v so the product stays equal.

| Geometry | Velocity |
|----------|----------|
| Wider pipe / larger A | Slower v |
| Narrower pipe / smaller A | Faster v |

If area decreases by 10×, speed increases by 10× (idealised steady incompressible case).

### Blood

Blood is treated as **essentially incompressible** → use A₁v₁ = A₂v₂.

### Worked example — stenosis

A₁ = 0.08 m², v₁ = 0.4 m/s; A₂ = 0.02 m².

```
A₁ v₁ = A₂ v₂
v₂ = (0.08 × 0.4) / 0.02 = 1.6 m/s
```

Velocity rises **4×** in the narrowed section.

**Clinical framing:** vascular narrowing (stenosis) raises blood speed in the throat of the stenosis (continuity).

### Why speed rises at a stenosis

Velocity increases at a carotid stenosis because **area decreases**, so **speed increases** to keep A v constant (continuity).

---

## 6. Clinical / medical links

| Physics | Medicine |
|---------|----------|
| Laminar flow (parallel layers, fastest in the centre) | Normal flow in healthy arteries |
| Turbulent flow (swirling, mixing layers) | Energy loss, higher resistance, poorer tissue perfusion |
| Continuity (smaller A → larger v) | Faster blood in a narrowed segment (stenosis, e.g. carotid) |
| High speed or irregular vessel → turbulence | Murmur over a stenotic or diseased valve |
| Blood ≈ incompressible | Use A₁v₁ = A₂v₂ for blood flow problems |

---

## 7. Formula sheet — Chapter 3

```
Mass flow rate = m / t = ρ A v         ← density × area × speed      [kg/s]
Volume flow rate Q = A v               ← area × speed (no density)    [m³/s]
Continuity (general): ρ₁ A₁ v₁ = ρ₂ A₂ v₂   ← mass flow conserved
Continuity (blood ≈ incompressible): A₁ v₁ = A₂ v₂   ← volume flow conserved (ρ cancels)
v₂ = A₁ v₁ / A₂                        ← speed in the second section
```

### Flow types at a glance

- Laminar: smooth parallel layers · parabolic profile · fastest in the centre, slowest at the wall · healthy arteries  
- Turbulent: wild swirl · layers mix · more energy loss and resistance · murmurs  
- Triggers for turbulence: high velocity, vessel irregularity, sudden narrowing  

### Memory anchors

- Narrower → faster (area × speed stays the same)  
- Area 10× smaller → speed 10× larger; the stenosis example: area 4× smaller → 1.6 m/s instead of 0.4 m/s  
- Mass flow has ρ; volume flow does not  
- Same symbol Q can mean mass or volume flow: check the units (kg/s vs m³/s)  

### Medical anchors

- Healthy artery → laminar  
- Stenosis → faster flow (continuity), often turbulent  
- Diseased valve → turbulence → audible murmur  
- Turbulence wastes energy in sideways motion → poorer perfusion
