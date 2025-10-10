"use client";

import React, { useEffect, useState } from "react";

const config = {
  localStorage: {
    playerData: "PLAYERDATA",
  },
};

export default function App(props) {
  const row = {
    nomeGiocatore: { type: "text", value: "" },
    prezzoBin: { type: "number", value: 0 },
    prezzoAcquistoAttuale: { type: "number", value: 0 },
    prezzoAcquistoMassimo: {
      type: "number",
      value: "",
      fn: (id, elementId) => {
        //questa funzione calcola il prezzo massimo che non si deve superare per ottenere un profit dalla vendita del giocatore
        //id: è l'id dell'input prezzo bin su cui si deve calcolare la formula
        //elementId: è l'id dell'elemento dove va settato il valore calcolato con la formula (è e.target)
        const priceBin = document.getElementById(`prezzoBin_${id}`)?.value;
        if (priceBin) {
          const element = document.getElementById(elementId);
          element.value = parseInt(priceBin) - parseInt(priceBin) * 0.6;
        }
      },
    },
    prezzoVendita: { type: "number", value: "" },
    guadagnoNetto: { type: "number", value: "" },
  };

  const [rows, setRows] = useState(
    Array(5)
      .fill()
      .map(() => ({ ...row }))
  );

  // quandosi carica la pagina cerca dentro il localstorage i valori vecchi
  useEffect(() => {
    var playerData = localStorage.getItem(config.localStorage.playerData);
    if (playerData) {
      playerData = JSON.parse(playerData);
      setRows(playerData);
    }
  }, []);

  // click sul pulsante aggiungi riga
  const addRows = () => {
    setRows((prev) => [...prev, row]);
  };

  // click sul pulsante pulisci
  const clearAll = () => {
    const ris = confirm("Vuoi eliminare tutti i giocatori");
    if (!ris) return;

    localStorage.setItem(config.localStorage.playerData, []);
    setRows(
      Array(5)
        .fill()
        .map(() => ({ ...row }))
    );
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <p className="text-2xl text-black font-bold text-center py-10">
        TAX CALCULATOR FC 26
      </p>
      <div className="max-w-6xl mx-auto">
        <div className="flex gap-3">
          <button
            onClick={addRows}
            className="mb-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition cursor-pointer"
          >
            Aggiungi Riga
          </button>
          <button
            onClick={clearAll}
            className="mb-4 px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition cursor-pointer"
          >
            Pulisci
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
            <thead className="bg-gray-200 text-black">
              <tr>
                <th className="py-2 px-4 text-left">Nome Giocatore</th>
                <th className="py-2 px-4 text-left">Prezzo BIN</th>
                <th className="py-2 px-4 text-left">Prezzo Acquisto Attuale</th>
                <th className="py-2 px-4 text-left">Prezzo Acquisto Massimo</th>
                <th className="py-2 px-4 text-left">Prezzo Vendita</th>
                <th className="py-2 px-4 text-left">Guadagno Netto</th>
              </tr>
            </thead>
            <tbody className="text-black h-10 overflow-y-hidden">
              {rows.map((row, index) => {
                return <TableRow key={index} row={row} index={index} />;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TableRow({ row, index }) {
  return (
    <tr>
      {Object.entries(row).map(([name, value], i) => {
        return (
          <InputRow
            key={i}
            dataInput={{ name: name, ...value, index: index }}
            dataRow={row}
          />
        );
      })}
    </tr>
  );
}

function InputRow({ dataInput, dataRow }) {
  const { name, type, value, index, fn } = dataInput;
  console.log(dataRow);

  // quando esci dal foucus dell'input il valore viene gestito
  const handleValue = (e) => {
    if (e.target.type === "text") return;
    e.target.value = roundValue(parseInt(e.target.value));
  };

  // elementId: id dell'elemento che si sta creando
  const elementId = `${name}_${index}`;

  return (
    <td key={name} className="p-2">
      <input
        type={type}
        id={elementId}
        defaultValue={fn ? fn(index, elementId) : value}
        onBlur={handleValue}
        className="w-full border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </td>
  );
}

// funzione per arrotondare i valori secondo le logiche di fc
function roundValue(value = 0) {
  //step è il valore di incremento in base al valore passato
  var step = 0;
  if (value < 1000) {
    step = 50;
  } else if (value < 10000) {
    step = 100;
  } else if (value < 100000) {
    step = 250;
  } else {
    step = 1000;
  }

  //calcolare il resto del modulo
  const remainder = value % step;
  let rounded = 0;
  if (remainder < step / 2) {
    rounded = value - remainder;
  } else {
    rounded = value + (step - remainder);
  }
  return rounded;
}
