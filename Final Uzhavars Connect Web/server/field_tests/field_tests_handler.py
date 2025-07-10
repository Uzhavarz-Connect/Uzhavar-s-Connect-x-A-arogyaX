from .advanced_investment_analysis import get_advanced_investment_analysis
from .air_quality_analysis import get_air_quality_analysis
from .crop_profitability_analysis import get_crop_profitability_analysis
from .crop_rotation_management import get_crop_rotation_management
from .dynamic_pricing import get_dynamic_pricing_strategy
from .location_services import get_location_services
from .market_intelligence_and_pricing import get_market_intelligence_system
from .seasonal_insights import get_seasonal_insights_analysis
from .soil_analysis_and_management import get_soil_analysis_management
from .trends_methods import get_climate_analysis_helpers
from .weather_risk_assessment import get_weather_risk_assessment


contents = {
    'advanced investment analysis': get_advanced_investment_analysis,
    'air quality analysis': get_air_quality_analysis,
    'crop profitability analysis': get_crop_profitability_analysis,
    'crop rotation management': get_crop_rotation_management,
    'dynamic pricing': get_dynamic_pricing_strategy,
    'location services': get_location_services,
    'market intelligence and pricing': get_market_intelligence_system,
    'seasonal insights': get_seasonal_insights_analysis,
    'soil analysis and management': get_soil_analysis_management,
    'trends methods': get_climate_analysis_helpers,
    'weather risk assessment': get_weather_risk_assessment,
}


class FieldTestsHandler:
    def __init__(self):
        self._history = {}

    def get_content(self, title):
        if title not in self._history:
            self._history[title] = contents[title]()
        return self._history[title]
