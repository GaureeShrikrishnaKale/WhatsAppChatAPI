import CustomButton from "./whatsapp-chat-api/CustomButton";

function App() {
  return (
    <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", textAlign: "center", alignContent: "center", alignItems: "center", gap: "10px", height: "90vh" }}>
      <CustomButton label={"Static Message"} />
      <CustomButton label={"Dynamic URI Message"} />
      <CustomButton label={"File Upload Message"} />
    </div>
  );
}

export default App;
