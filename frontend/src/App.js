import React, { useState } from "react";
import axios from "axios";

const App = () => {
    const [jsonInput, setJsonInput] = useState("");
    const [responseData, setResponseData] = useState(null);
    const [fileBase64, setFileBase64] = useState("");
    const [dropdownOptions, setDropdownOptions] = useState([]);
    const [error, setError] = useState("");
    // const [title, setTitle] = useState("123456");


    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setFileBase64(reader.result.split(",")[1]); // Extract Base64 string
          };
          reader.readAsDataURL(file);
      }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
        const payload = JSON.parse(jsonInput);
        if (fileBase64) {
            payload.file = fileBase64; // Add the Base64 file to the JSON payload
        }
        const response = await axios.post("https://bajaj-backend-ib7z.onrender.com/bfhl", payload);
        setResponseData(response.data);
        console.log(response.data);
        // setTitle(response.data.);
        document.title = response.data.college_roll_number;
        setError("");
    } catch (err) {
        setError("Invalid JSON or server error");
    }
};

    const renderResponse = () => {
        if (!responseData) return null;
        const { alphabets, numbers, highest_lowercase } = responseData;

        const selectedData = {
            Alphabets: alphabets,
            Numbers: numbers,
            "Highest Lowercase Alphabet": highest_lowercase,
        };

        return dropdownOptions.map((option) => (
            <div key={option}>
                <h3>{option}</h3>
                <p>{JSON.stringify(selectedData[option])}</p>
            </div>
        ));
    };

    return (
        <div>
            {/* <h1>{title}</h1> */}
            <form onSubmit={handleSubmit}>
                <textarea
                    rows="10"
                    cols="50"
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder='Enter JSON input here'
                />
                <br />
                <input type="file" onChange={handleFileChange} />
                <br />
                <button type="submit">Submit</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {responseData && (
                <>
                    <select
                        multiple
                        onChange={(e) =>
                            setDropdownOptions(
                                Array.from(e.target.selectedOptions, (option) => option.value)
                            )
                        }
                    >
                        <option value="Alphabets">Alphabets</option>
                        <option value="Numbers">Numbers</option>
                        <option value="Highest Lowercase Alphabet">Highest Lowercase Alphabet</option>
                    </select>
                    {renderResponse()}
                </>
            )}
        </div>
    );
};

export default App;
