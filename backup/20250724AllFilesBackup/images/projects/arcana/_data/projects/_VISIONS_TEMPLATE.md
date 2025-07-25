# 🎨 Project Template: Visions (Art)

Use this template to structure the content for a new **art** project. This "content-first" approach allows you to focus on the narrative and creative vision. I will then translate this into a fully functional, cinematic user journey on the website.

---

## **1. Core Information**

Provide the essential details for the project.

- **Title:** The official title of the art series or project.
- **Pitch:** A one-sentence hook. What is the central question or idea? (e.g., "What happens when archetypes are stripped of their mystical costumes and shown as just humans?")
- **Description:** A slightly longer, one-paragraph description for the main portfolio grid.
- **Challenge:** What was the primary creative or technical challenge you faced?
- **Development:** How did you approach the project? What was your process?
- **Outcome:** What was the final result? What did you create or discover?

---

## **2. Artist's Statement**

This section is for the deeper narrative content that will appear on the project detail page.

### **Process Narrative**
*(This will populate the "Creative Process" section. Use HTML for formatting if you like.)*
> Example: `<h3>The Sacred in the Banal</h3><p>The creative process for *Archetypes at Rest* was one of translation. It involved taking the grand, symbolic language of the tarot and finding its quiet echo in the modern world...</p>`

### **Inspiration Narrative**
*(This will populate the "Inspiration & Influences" section. Use HTML for formatting if you like.)*
> Example: `<h3>Finding the Mythic in the Mundane</h3><p>This series was inspired by the idea that our lives are already full of myth and meaning—if only we stop to see them...</p>`

---

## **3. Storyboard Flow (The Journey)**

Describe the narrative flow of the project page. Each item will become a step in the scrolling "Journey" timeline.

| Scene Order | `title` (Thematic Title) | `description` (Animation/Transition Note) |
| :--- | :--- | :--- |
| 1 | Temptation vs. Love | Fade-in, slight zoom-in on bar, golden halos shimmer |
| 2 | Cycles of Life & Death | Pan up through greenhouse vines, fade to dusty soil |
| 3 | Balance in the Mundane | Parallax: laundry machines rotate subtly, neon flickers |

---

## **4. Critical Analysis (The Specs)**

What are the key artistic or conceptual strengths of this project? Each item here will become a "Unique Value Proposition" (a Spec card).

- **Spec 1 Title:** Mythic Framing
  - **Spec 1 Description:** The centrality of the figures and their interaction is often framed like a Renaissance painting, elevating everyday settings to something mythic.
- **Spec 2 Title:** Conceptual Tension
  - **Spec 2 Description:** The pairings thrive on juxtaposition and irony, recasting traditional conflicts into contemporary choices.

---

## **5. Gallery & Hotspots**

List all the images for the gallery. For any image that needs a guided tour, add a `hotspots` array.

**Image 1:**
- **`url`:** `images/projects/your-project/image-1.jpg`
- **`title`:** The Lovers & The Devil
- **`description`:** We begin at a rooftop bar...
- **`hotspots`:**
  - **Hotspot 1:**
    - `"x": 50`, `"y": 40`
    - `"title": "A Sacred Vow"`
    - `"description": "Their hands clasp in a perfect heart..."`
  - **Hotspot 2:**
    - `"x": 85`, `"y": 60`
    - `"title": "A Quiet Temptation"`
    - `"description": "The Devil’s drink catches the light..."`

**Image 2:**
- **`url`:** `images/projects/your-project/image-2.jpg`
- **`title`:** The Empress & Death
- **`description`:** Next we step into a greenhouse...
- **`hotspots`:** *(This image has no hotspots, so the array is omitted.)*

---

## **6. Developer-Ready JSON (Optional)**

If you're comfortable, you can pre-fill the JSON structure here. Otherwise, I will generate this from the content you provide above.

```json
{
  "id": 99,
  "title": "",
  "description": "",
  "imageUrl": "",
  "medium": "art",
  "genre": [],
  "style": [],
  "tech": [],
  "mood": "",
  "year": 2024,
  "role": "",
  "variant": "",
  "status": "",
  "links": {},
  "pitch": "",
  "challenge": "",
  "development": "",
  "outcome": "",
  "process": "",
  "inspiration": "",
  "gallery": [
    {
      "url": "",
      "title": "",
      "description": "",
      "hotspots": [
        {
          "x": 0,
          "y": 0,
          "title": "",
          "description": ""
        }
      ]
    }
  ],
  "journey": [
    {
      "title": "",
      "description": ""
    }
  ],
  "specs": [
    {
      "title": "",
      "description": ""
    }
  ]
}
``` 