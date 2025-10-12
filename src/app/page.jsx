"use client";

import React, { useEffect, useState } from "react";

const config = {
  localStorage: {
    playerData: "PLAYERDATA",
  },
  rowProperties:{
    nomeGiocatore: { type: "text"},
    prezzoBin: { type: "number"},
    prezzoAcquistoAttuale: { type: "number"},
    prezzoAcquistoMassimo: { type: "number", disabled: true },
    prezzoVendita: { type: "number", disabled: true },
    guadagnoNetto: { type: "number", disabled: true },
  }
};

export default function App(props) {
  const exampleRow = {
    nomeGiocatore: "",
    prezzoBin: 0,
    prezzoAcquistoAttuale: 0,
    prezzoAcquistoMassimo: 0,
    prezzoVendita: 0,
    guadagnoNetto: 0,
  };


  const [rows, setRows] = useState(
    Array(5)
      .fill()
      .map(() => ({ ...exampleRow }))
  );

  // quandosi carica la pagina cerca dentro il localstorage i valori vecchi
  useEffect(() => {
    //recupera i dati dal localstorage
    var playerData = localStorage.getItem(config.localStorage.playerData);

    // se il playerData non è settato imposta un valore di default
    if(!playerData){
      localStorage.setItem(config.localStorage.playerData, JSON.stringify(rows));
      return
    }

    // parse data
    playerData = JSON.parse(playerData);

    //se non ci sono elementi nell'array imposta un valore di default
    if (playerData.length === 0) {
        localStorage.setItem(config.localStorage.playerData, JSON.stringify(rows));
        return;
    };

    //carica i data
    setRows(playerData)
  }, []);

  // click sul pulsante aggiungi riga
  const addRows = () => {
    setRows((prev) => [...prev, exampleRow]);
  };

  // click sul pulsante pulisci
  const clearAll = () => {
    const ris = confirm("Vuoi eliminare tutti i giocatori");
    if (!ris) return;

    localStorage.setItem(config.localStorage.playerData, JSON.stringify(Array(5).fill().map(() => ({ ...exampleRow }))));
    window.location = "/"
  };

  return (
    <div className="p-6 bg-zinc-900 min-h-screen">
      <p className="text-2xl text-white font-bold text-center py-10">
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

        <div className="overflow-auto h-full max-h-[450px] md:max-h-[500px]">
          <table className="min-w-full bg-zinc-800 shadow rounded-lg overflow-hidden">
            <thead className="bg-zinc-800 text-white">
              <tr>
                <th className="py-2 px-4 text-left">Nome Giocatore</th>
                <th className="py-2 px-4 text-left">Prezzo BIN</th>
                <th className="py-2 px-4 text-left">Prezzo Acquisto Attuale</th>
                <th className="py-2 px-4 text-left">Prezzo Acquisto Massimo</th>
                <th className="py-2 px-4 text-left">Prezzo Vendita</th>
                <th className="py-2 px-4 text-left">Guadagno Netto</th>
              </tr>
            </thead>
            <tbody className="text-black">
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
  // quando si esce dal foucus la funzione valuta il valore e imposta gli altri campi
  const handleValue = (e) => {
    // quando viene settato il valore aggiorna di conseguenza tutti gli altri campi della riga
    if (e.target.id.startsWith("prezzoBin")) {
      var prezzoBinVal = e.target.value;
      const prezzoAcquistoMassimoInput = document.getElementById(
        `prezzoAcquistoMassimo_${index}`
      );
      const prezzoVenditaInput = document.getElementById(
        `prezzoVendita_${index}`
      );

      //formula per calcolare il prezzo massimo
      prezzoAcquistoMassimoInput.value = roundValue(
        prezzoBinVal - prezzoBinVal * 0.06
      );

      // formula per calcolare il prezzo di vendita
      prezzoVenditaInput.value = roundValue(prezzoBinVal - prezzoBinVal * 0.01);
    }

    // quando viene settato il valore aggiorna di conseguenza tutti gli altri campi della riga
    if (e.target.id.startsWith("prezzoAcquistoAttuale")) {
      const prezzoAcquistoAttualeVal = e.target.value;
      const guadagnoNettoVal = document.getElementById(
        `guadagnoNetto_${index}`
      );
      const prezzoVenditaVal = document.getElementById(
        `prezzoVendita_${index}`
      )?.value;

      // formula per calcolare il guadagno netto
      guadagnoNettoVal.value =
        prezzoVenditaVal - prezzoVenditaVal * 0.05 - prezzoAcquistoAttualeVal;
    }

    // arrotonda i valori secondo le logiche di fc usando la funzione definita
    if (e.target.type != "text") {
      e.target.value = roundValue(e.target.value);
    }

    // sincronizza i dati nel payload
    var playerData = localStorage.getItem(config.localStorage.playerData);
    playerData = JSON.parse(playerData);

    playerData[index] = {
      nomeGiocatore: document.getElementById(`nomeGiocatore_${index}`)?.value || "",
      prezzoBin: document.getElementById(`prezzoBin_${index}`)?.value || 0,
      prezzoAcquistoAttuale: document.getElementById(`prezzoAcquistoAttuale_${index}`)?.value || 0,
      prezzoAcquistoMassimo:document.getElementById(`prezzoAcquistoMassimo_${index}`)?.value || 0,
      prezzoVendita: document.getElementById(`prezzoVendita_${index}`)?.value || 0,
      guadagnoNetto: document.getElementById(`guadagnoNetto_${index}`)?.value || 0,
    };
    localStorage.setItem(config.localStorage.playerData, JSON.stringify(playerData));
  };

  return (
    <tr>
      {Object.keys(row).map((key, i) => {
        const data = row[key];
        const settings = config.rowProperties[key]
        return (
          <td key={i} className="p-2 bg-zinc-700">
            <input
              key={key}
              type={settings.type}
              id={`${key}_${index}`}
              defaultValue={data}
              onBlur={handleValue}
              disabled={settings.disabled}
              className={`w-full border border-zinc-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-zinc-600`}
            />
          </td>
        );
      })}
    </tr>
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




