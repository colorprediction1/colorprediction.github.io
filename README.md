import tkinter as tk
from tkinter import ttk
import pandas as pd
from sklearn.neighbors import KNeighborsClassifier

# --- 1. Dataset embed karna (chhota sa example) ---
# Zyada colors jod sakte ho, yeh sirf demo ke liye
data = {
    'color_name': ['Black', 'White', 'Red', 'Lime', 'Blue', 'Yellow', 'Cyan', 'Magenta', 'Gray'],
    'R': [0, 255, 255, 0, 0, 255, 0, 255, 128],
    'G': [0, 255, 0, 255, 0, 255, 255, 0, 128],
    'B': [0, 255, 0, 0, 255, 0, 255, 255, 128]
}
df = pd.DataFrame(data)

X = df[['R', 'G', 'B']]
y = df['color_name']

# --- 2. Train KNN model ---
model = KNeighborsClassifier(n_neighbors=1)
model.fit(X, y)

# --- 3. Prediction function ---
def predict_color(r, g, b):
    pred = model.predict([[r, g, b]])
    return pred[0]

# --- 4. GUI using Tkinter ---
class ColorPredictorApp:
    def __init__(self, root):
        self.root = root
        root.title("Color Predictor")

        # Labels and sliders for R, G, B
        self.labels = {}
        self.scales = {}
        for i, channel in enumerate(["R", "G", "B"]):
            lbl = ttk.Label(root, text=channel + ":")
            lbl.grid(row=i, column=0, padx=5, pady=5)
            self.labels[channel] = lbl

            scale = ttk.Scale(root, from_=0, to=255, orient='horizontal')
            scale.set(0)
            scale.grid(row=i, column=1, padx=5, pady=5, sticky="we")
            self.scales[channel] = scale

        # Button to predict
        btn = ttk.Button(root, text="Predict Color", command=self.on_predict)
        btn.grid(row=3, column=0, columnspan=2, pady=10)

        # Label to show result
        self.result_label = ttk.Label(root, text="Predicted Color: —", font=("Arial", 14))
        self.result_label.grid(row=4, column=0, columnspan=2, pady=10)

        # Canvas to show the actual color
        self.color_canvas = tk.Canvas(root, width=100, height=50, bg="white", bd=2, relief="sunken")
        self.color_canvas.grid(row=5, column=0, columnspan=2, pady=10)

    def on_predict(self):
        # Read the scale values
        r = int(self.scales["R"].get())
        g = int(self.scales["G"].get())
        b = int(self.scales["B"].get())

        # Get prediction
        color_name = predict_color(r, g, b)

        # Update result
        self.result_label.config(text=f"Predicted Color: {color_name}")

        # Update canvas background
        hex_code = f'#{r:02x}{g:02x}{b:02x}'
        self.color_canvas.config(bg=hex_code)


if __name__ == "__main__":
    root = tk.Tk()
    app = ColorPredictorApp(root)
    root.mainloop()
