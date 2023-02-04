"""
    Title: rachwalik_calculator.py
    Author: David Rachwalik
    Date: 2022/05/08
    Description: Calculator test script in Python
"""

def add(num1, num2):
    """Add together two numbers"""
    return num1 + num2

def subtract(num1, num2):
    """Subtract apart two numbers"""
    return num1 - num2

def divide(num1, num2):
    """Divide two number values"""
    if num2 == 0:
        return float("NaN")
    else:
        return num1 / num2

# Example runs
print(add(1, 2))
print(subtract(4, 1))
print(divide(8, 2))
print(divide(8, 0))
