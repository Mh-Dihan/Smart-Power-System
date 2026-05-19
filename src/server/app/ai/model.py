from .predictor import PowerPredictor

# Singleton instance
_predictor = None

def get_predictor() -> PowerPredictor:
    global _predictor
    if _predictor is None:
        _predictor = PowerPredictor()
    return _predictor
