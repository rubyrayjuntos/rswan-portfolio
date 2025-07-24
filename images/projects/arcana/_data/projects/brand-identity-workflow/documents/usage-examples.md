# Brand Identity Workflow - Usage Examples

## Quick Start Examples

### Example 1: Simple HTML Interface

The fastest way to get started with brand identity generation:

```html
<!-- simple_brand_gui.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Brand Identity Generator</title>
</head>
<body>
    <form id="brandForm">
        <input type="password" id="apiKey" placeholder="OpenAI API Key" />
        <input type="text" id="brandName" placeholder="Brand Name" />
        <select id="industry">
            <option value="technology">Technology</option>
            <option value="healthcare">Healthcare</option>
            <option value="finance">Finance</option>
        </select>
        <textarea id="description" placeholder="Brand description..."></textarea>
        <select id="style">
            <option value="modern">Modern & Minimalist</option>
            <option value="classic">Classic & Professional</option>
            <option value="playful">Playful & Creative</option>
        </select>
        <button type="submit">Generate Brand Identity</button>
    </form>
</body>
</html>
```

**Usage:**
1. Open the HTML file in your browser
2. Enter your OpenAI API key
3. Fill in brand details
4. Click "Generate"
5. Get comprehensive brand identity in seconds

### Example 2: Python Advanced System

For more complex workflows with the full multi-agent system:

```python
from main import BrandIdentityWorkflow

# Initialize the workflow
workflow = BrandIdentityWorkflow()

# Define brand brief
tech_brief = {
    'brand_name': 'DataFlow',
    'industry': 'Data Analytics & Business Intelligence',
    'target_audience': 'Data scientists, business analysts, and IT professionals aged 28-45',
    'brand_values': ['Innovation', 'Clarity', 'Efficiency', 'Insight', 'Reliability'],
    'style_preference': 'modern',
    'desired_mood': 'innovative',
    'brand_voice': 'confident and approachable',
    'mission': 'To democratize data analytics by making complex insights accessible to everyone',
    'vision': 'To be the leading platform that transforms raw data into actionable business intelligence',
    'competitors': ['Tableau', 'Power BI', 'Looker'],
    'unique_selling_proposition': 'AI-powered insights with natural language queries and automated reporting',
    'marketing_goals': ['Establish thought leadership', 'Drive product adoption', 'Build developer community'],
    'budget_considerations': 'Premium pricing with enterprise focus',
    'timeline': '6-12 months for full market presence'
}

# Run complete workflow
results = workflow.run_complete_workflow(tech_brief)

# Save results
workflow.save_results("DataFlow_results.json")

print("Brand Identity Generated Successfully!")
```

## Industry-Specific Examples

### Technology Startup

```python
tech_startup_brief = {
    'brand_name': 'CloudSync',
    'industry': 'Cloud Computing & SaaS',
    'target_audience': 'Small to medium businesses looking for affordable cloud solutions',
    'brand_values': ['Simplicity', 'Reliability', 'Innovation', 'Accessibility'],
    'style_preference': 'tech',
    'desired_mood': 'innovative',
    'brand_voice': 'friendly and technical',
    'mission': 'Making cloud computing simple and accessible for every business',
    'unique_selling_proposition': 'Enterprise-grade cloud solutions at startup prices',
    'marketing_goals': ['Drive user acquisition', 'Build brand awareness', 'Generate enterprise leads']
}
```

**Expected Output:**
- Modern, tech-focused logo concepts
- Blue and green color palette (trust and growth)
- Clean, minimalist typography
- Comprehensive marketing strategies for tech audience

### Healthcare Brand

```python
healthcare_brief = {
    'brand_name': 'VitalCare',
    'industry': 'Healthcare & Wellness',
    'target_audience': 'Health-conscious individuals aged 30-60',
    'brand_values': ['Trust', 'Care', 'Innovation', 'Wellness', 'Compassion'],
    'style_preference': 'professional',
    'desired_mood': 'trustworthy',
    'brand_voice': 'caring and professional',
    'mission': 'Empowering individuals to take control of their health journey',
    'unique_selling_proposition': 'Personalized healthcare solutions with cutting-edge technology',
    'marketing_goals': ['Build trust and credibility', 'Educate on health topics', 'Drive patient engagement']
}
```

**Expected Output:**
- Professional, trustworthy logo designs
- Calming color palette (blues, greens, soft neutrals)
- Accessible typography choices
- HIPAA-compliant marketing strategies

### Creative Agency

```python
creative_brief = {
    'brand_name': 'PixelCraft',
    'industry': 'Creative Agency & Design',
    'target_audience': 'Startups and growing businesses needing creative services',
    'brand_values': ['Creativity', 'Innovation', 'Quality', 'Collaboration', 'Excellence'],
    'style_preference': 'playful',
    'desired_mood': 'energetic',
    'brand_voice': 'creative and enthusiastic',
    'mission': 'Transforming ideas into compelling visual stories',
    'unique_selling_proposition': 'Boutique creative agency with big agency quality',
    'marketing_goals': ['Showcase creative portfolio', 'Attract innovative clients', 'Build creative community']
}
```

**Expected Output:**
- Bold, creative logo concepts
- Vibrant, energetic color palette
- Creative typography combinations
- Social media-focused marketing strategies

## Advanced Configuration Examples

### Custom Agent Configuration

```python
from agents import get_brand_identity_agents, get_marketing_agents

# Get all agents
brand_agents = get_brand_identity_agents()
marketing_agents = get_marketing_agents()

# Customize agent behavior
logo_designer = brand_agents['logo_designer']
logo_designer.goal = "Generate innovative, minimalist logo concepts with focus on scalability"

# Create custom crew
from crewai import Crew

brand_crew = Crew(
    agents=[brand_agents['brand_identity_coordinator'], logo_designer],
    tasks=[brand_identity_coordination_task, logo_design_task],
    verbose=True
)
```

### Environment Configuration

```python
# config.py
import os

OPENAI_CONFIG = {
    'api_key': os.getenv('OPENAI_API_KEY'),
    'model': 'gpt-4',
    'temperature': 0.7,
    'max_tokens': 4000
}

APP_CONFIG = {
    'debug': True,
    'log_level': 'INFO',
    'max_workers': 4,
    'timeout': 300,
    'retry_attempts': 3
}

# Environment variables (.env)
OPENAI_API_KEY=your_openai_api_key_here
DALLE_API_KEY=your_dalle_api_key_here
STABILITY_AI_API_KEY=your_stability_ai_api_key_here
```

### Custom Output Models

```python
from pydantic import BaseModel, Field
from typing import List

class CustomLogoConcept(BaseModel):
    """Custom logo concept with additional fields."""
    id: str = Field(..., description="Unique identifier")
    name: str = Field(..., description="Logo name")
    description: str = Field(..., description="Logo description")
    style: str = Field(..., description="Design style")
    target_audience: str = Field(..., description="Target audience")
    brand_alignment: str = Field(..., description="Brand value alignment")
    scalability_notes: str = Field(..., description="Scalability considerations")
    usage_guidelines: List[str] = Field(..., description="Usage guidelines")
```

## Integration Examples

### Streamlit Web Application

```python
import streamlit as st
from main import BrandIdentityWorkflow

def main():
    st.title("Brand Identity Generator")
    
    # Input form
    with st.form("brand_form"):
        brand_name = st.text_input("Brand Name")
        industry = st.selectbox("Industry", ["Technology", "Healthcare", "Finance", "Creative"])
        description = st.text_area("Brand Description")
        style = st.selectbox("Style Preference", ["Modern", "Classic", "Playful", "Professional"])
        
        submitted = st.form_submit_button("Generate Brand Identity")
        
        if submitted:
            with st.spinner("Generating your brand identity..."):
                workflow = BrandIdentityWorkflow()
                
                brief = {
                    'brand_name': brand_name,
                    'industry': industry,
                    'description': description,
                    'style_preference': style.lower()
                }
                
                results = workflow.run_complete_workflow(brief)
                
                # Display results
                st.success("Brand Identity Generated!")
                st.json(results)

if __name__ == "__main__":
    main()
```

### API Integration

```python
from flask import Flask, request, jsonify
from main import BrandIdentityWorkflow

app = Flask(__name__)
workflow = BrandIdentityWorkflow()

@app.route('/generate-brand', methods=['POST'])
def generate_brand():
    try:
        data = request.get_json()
        
        # Validate input
        required_fields = ['brand_name', 'industry', 'description']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Generate brand identity
        results = workflow.run_complete_workflow(data)
        
        return jsonify({
            'success': True,
            'data': results,
            'message': 'Brand identity generated successfully'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
```

## Output Examples

### Brand Identity Output

```json
{
  "brand_name": "DataFlow",
  "logo_concepts": [
    {
      "id": "concept_1",
      "name": "DataFlow_modern_minimal",
      "description": "Modern, minimalist logo with flowing data elements",
      "rationale": "Clean design reflecting modern aesthetic and data flow concept",
      "style": "modern",
      "file_path": "assets/logos/DataFlow_concept_1.png",
      "use_cases": ["Digital applications", "Print materials", "Branding"],
      "variations": ["horizontal", "vertical", "icon-only"]
    }
  ],
  "color_palette": {
    "primary": {
      "name": "Data Blue",
      "hex": "#1A365D",
      "rgb": "26, 54, 93",
      "usage": "Main brand color",
      "psychology": "Trust, stability, intelligence"
    },
    "secondary": {
      "name": "Innovation Green",
      "hex": "#38A169",
      "rgb": "56, 161, 105",
      "usage": "Accent color",
      "psychology": "Growth, innovation, success"
    }
  },
  "style_guide": {
    "typography": {
      "primary_font": "Inter",
      "secondary_font": "Roboto Mono",
      "usage_guidelines": "Use Inter for headings, Roboto Mono for data displays"
    },
    "imagery_style": {
      "photography_style": "Clean, modern, data-focused",
      "illustration_style": "Minimalist, geometric, tech-inspired"
    }
  }
}
```

### Marketing Strategy Output

```json
{
  "social_media_strategy": {
    "platforms": {
      "linkedin": [
        {
          "caption": "Transforming raw data into actionable insights. See how DataFlow helps businesses make better decisions.",
          "hashtags": ["#DataAnalytics", "#BusinessIntelligence", "#DataFlow"],
          "visual_concept": "Dashboard screenshot with key metrics highlighted"
        }
      ]
    },
    "content_themes": ["Data insights", "Business intelligence", "Analytics tips"],
    "posting_schedule": {
      "linkedin": "Tuesday, Thursday, Friday at 9 AM",
      "twitter": "Monday, Wednesday, Friday at 10 AM"
    }
  },
  "email_marketing_strategy": {
    "campaigns": [
      {
        "campaign_type": "welcome",
        "subject_line": "Welcome to DataFlow - Your Data Journey Starts Here",
        "body_content": "Thank you for choosing DataFlow...",
        "call_to_action": "Explore Your Dashboard"
      }
    ]
  }
}
```

## Best Practices

### 1. Brand Brief Preparation
- Be specific about target audience
- Include clear brand values and mission
- Provide competitor information
- Define style preferences clearly

### 2. API Key Management
- Use environment variables
- Never commit API keys to version control
- Implement rate limiting
- Monitor API usage

### 3. Output Validation
- Always validate outputs against Pydantic models
- Implement error handling for failed generations
- Save intermediate results for debugging
- Test with various input scenarios

### 4. Performance Optimization
- Cache frequently used data
- Implement parallel processing where possible
- Monitor resource usage
- Optimize API calls

### 5. Quality Assurance
- Review generated outputs for brand alignment
- Test outputs across different use cases
- Gather user feedback
- Iterate based on results

## Troubleshooting

### Common Issues

1. **API Key Errors**
   - Verify API key is valid and has sufficient credits
   - Check environment variable configuration
   - Ensure proper API key format

2. **Generation Failures**
   - Check input data validation
   - Review error logs for specific issues
   - Verify network connectivity
   - Check API rate limits

3. **Output Quality Issues**
   - Refine brand brief with more specific details
   - Adjust agent parameters and goals
   - Provide more context in descriptions
   - Test with different style preferences

### Debug Mode

```python
# Enable debug mode for detailed logging
import logging
logging.basicConfig(level=logging.DEBUG)

# Run workflow with verbose output
workflow = BrandIdentityWorkflow()
results = workflow.run_complete_workflow(brief, verbose=True)
```

This comprehensive set of examples demonstrates the flexibility and power of the Brand Identity Workflow system, from simple HTML interfaces to complex multi-agent orchestration. 