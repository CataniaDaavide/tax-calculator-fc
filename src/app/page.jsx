"use client";

import { Hand, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";

const config = {
  localStorage: {
    playerData: "PLAYERDATA",
  },
  rowProperties: {
    nomeGiocatore: { type: "text", title: "Nome Giocatore" },
    prezzoBin: { type: "number", title: "Prezzo BIN" },
    prezzoAcquistoAttuale: { type: "number", title: "Prezzo Acquisto Attuale	" },
    prezzoAcquistoMassimo: {
      type: "number",
      title: "Prezzo Acquisto Massimo	",
      disabled: true,
    },
    prezzoVendita: { type: "number", title: "Prezzo Vendita	", disabled: true },
    guadagnoNetto: { type: "number", title: "Guadagno Netto	", disabled: true },
  },
};

export default function TaxCalculator() {
  const exampleRow = {
    nomeGiocatore: "",
    prezzoBin: 0,
    prezzoAcquistoAttuale: 0,
    prezzoAcquistoMassimo: 0,
    prezzoVendita: 0,
    guadagnoNetto: 0,
  };

  const [rows, setRows] = useState(
    Array.from({ length: 5 }, () => ({ ...exampleRow }))
  );

  // al load della pagina recupera i dati dal localstorage
  useEffect(() => {
    //recupera i dati dal localstorage
    var playerData = localStorage.getItem(config.localStorage.playerData);

    // se il playerData non è settato imposta un valore di default
    if (!playerData) {
      localStorage.setItem(
        config.localStorage.playerData,
        JSON.stringify(rows)
      );
      return;
    }

    // parse data
    playerData = JSON.parse(playerData);

    //se non ci sono elementi nell'array imposta un valore di default
    if (playerData.length === 0) {
      localStorage.setItem(
        config.localStorage.playerData,
        JSON.stringify(rows)
      );
      return;
    }

    if (playerData.length < 5) {
      const amount = 5 - playerData.length;
      const newRows = Array.from({ length: amount }, () => ({ ...exampleRow }));
      playerData.push(...newRows);
    }

    //carica i data
    setRows(playerData);
  }, []);

  useEffect(() => {
    console.log(rows);
    localStorage.setItem(config.localStorage.playerData, JSON.stringify(rows));
  }, [rows]);

  // click sul pulsante aggiungi riga
  const addRows = () => {
    setRows((prev) => [...prev, exampleRow]);
  };

  // click sul pulsante pulisci
  const clearAll = () => {
    const ris = confirm("Vuoi eliminare tutti i giocatori");
    if (!ris) return;

    const playerData = Array.from({ length: 5 }, () => ({ ...exampleRow }));
    setRows(playerData);
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
                <th className="py-2 px-4 text-left">N.</th>
                {Object.entries(config.rowProperties).map(([key, x]) => (
                  <th key={key} className="py-2 px-4 text-left">
                    {x.title}
                  </th>
                ))}
                <th className="py-2 px-4 text-left">Azioni</th>
              </tr>
            </thead>
            <tbody className="text-black">
              {rows.map((row, index) => {
                return (
                  <TableRow
                    key={index}
                    setRows={setRows}
                    rows={rows}
                    row={row}
                    index={index}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TableRow({ setRows, rows, row, index }) {
  const [manual, setManual] = useState(false);

  // quando si esce dal foucus la funzione valuta il valore e imposta gli altri campi
  const handleValue = (e) => {
    const nomeGiocatoreInput = document.getElementById(
      `nomeGiocatore_${index}`
    );
    const prezzoBinInput = document.getElementById(`prezzoBin_${index}`);
    const prezzoAcquistoAttualeInput = document.getElementById(
      `prezzoAcquistoAttuale_${index}`
    );
    const prezzoAcquistoMassimoInput = document.getElementById(
      `prezzoAcquistoMassimo_${index}`
    );
    const prezzoVenditaInput = document.getElementById(
      `prezzoVendita_${index}`
    );
    const guadagnoNettoInput = document.getElementById(
      `guadagnoNetto_${index}`
    );

    // quando viene settato il valore aggiorna di conseguenza tutti gli altri campi della riga
    if (e.target.id.startsWith("prezzoBin") && !manual) {
      // formula per calcolare il prezzo massimo
      if (prezzoAcquistoMassimoInput && prezzoBinInput) {
        const prezzoBinVal = parseInt(prezzoBinInput.value);

        var percentage = 0;
        if (prezzoBinVal < 10 * 1000) {
          percentage = 0.16;
        } else if (prezzoBinVal < 100 * 1000) {
          percentage = 0.07;
        } else {
          percentage = 0.065;
        }
        prezzoAcquistoMassimoInput.value = roundValue(
          prezzoBinVal - prezzoBinVal * percentage
        );
      }

      // formula per calcolare il prezzo di vendita
      if (prezzoVenditaInput && prezzoBinInput) {
        const prezzoBinVal = parseInt(prezzoBinInput.value);

        var percentage = 0;
        if (prezzoBinVal < 10 * 1000) {
          percentage = 0.023;
        } else if (prezzoBinVal < 100 * 1000) {
          percentage = 0.018;
        } else {
          percentage = 0.013;
        }
        prezzoVenditaInput.value = roundValue(
          prezzoBinVal - prezzoBinVal * percentage
        );
      }
    }

    // formula per calcolare il guadagno netto
    if (guadagnoNettoInput && prezzoAcquistoAttualeInput) {
      const prezzoAcquistoAttualeVal = prezzoAcquistoAttualeInput.value;
      const prezzoAcquistoMassimoVal = prezzoAcquistoMassimoInput.value;
      const prezzoVenditaVal = prezzoVenditaInput.value;

      // rimuovo il colore del testo precedente
      guadagnoNettoInput.classList.remove(
        "!text-blue-300",
        "!text-red-500",
        "!text-green-500"
      );

      if (
        parseInt(prezzoAcquistoAttualeInput.value) === 0 ||
        prezzoAcquistoAttualeInput.value.length === 0
      ) {
        guadagnoNettoInput.value =
          prezzoVenditaVal - prezzoVenditaVal * 0.05 - prezzoAcquistoMassimoVal;

        if (
          parseInt(prezzoBinInput?.value) === 0 ||
          prezzoBinInput?.value.length === 0
        )
          return;

        // cambio il colore del testo
        guadagnoNettoInput.classList.add("!text-blue-300");
      } else {
        var color = "bg-red-500";
        guadagnoNettoInput.value =
          prezzoVenditaVal - prezzoVenditaVal * 0.05 - prezzoAcquistoAttualeVal;

        // cambio il colore del testo
        guadagnoNettoInput.value >= 0
          ? (color = "!text-green-500")
          : (color = "!text-red-500");
        guadagnoNettoInput.classList.add(color);
      }
    }

    // arrotonda i valori secondo le logiche di fc usando la funzione definita
    if (e.target.type != "text") {
      e.target.value = roundValue(e.target.value);
    }

    // aggiorna lo state dei dati
    const updatedRows = [...rows];
    updatedRows[index] = {
      nomeGiocatore: nomeGiocatoreInput?.value || "",
      prezzoBin: prezzoBinInput?.value || 0,
      prezzoAcquistoAttuale: prezzoAcquistoAttualeInput?.value || 0,
      prezzoAcquistoMassimo: prezzoAcquistoMassimoInput?.value || 0,
      prezzoVendita: prezzoVenditaInput?.value || 0,
      guadagnoNetto: guadagnoNettoInput?.value || 0,
    };
    setRows(updatedRows);
  };

  return (
    <tr className="bg-zinc-700">
      <td className="text-white text-center">{index + 1}</td>
      {Object.keys(row).map((key, i) => {
        const settings = config.rowProperties[key];
        return (
          <td key={i} className="p-2">
            <input
              key={key}
              type={settings.type}
              id={`${key}_${index}`}
              value={row[key]}
              onChange={(e) => {
                const updatedRows = [...rows];
                updatedRows[index][key] = e.target.value || 0;
                setRows(updatedRows); // aggiorna lo state
              }}
              onBlur={handleValue} // puoi mantenere il blur per i calcoli
              disabled={
                manual && key != "guadagnoNetto" ? false : settings.disabled
              }
              className="w-full border border-zinc-600 text-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-zinc-600"
            />
          </td>
        );
      })}
      <ActionRow
        index={index}
        manual={manual}
        setManual={setManual}
        setRows={setRows}
        rows={rows}
      />
    </tr>
  );
}

function ActionRow({ index, manual, setManual, setRows, rows }) {
  const handleDelete = (e) => {
    try {
      e.preventDefault();
      const nomeGiocatore = document.getElementById(
        `nomeGiocatore_${index}`
      )?.value;
      const ris = confirm(
        `Vuoi eliminare il giocatore ${nomeGiocatore?.toUpperCase()} alla riga ${
          index + 1
        }`
      );
      if (!ris) return;

      const updatedRows = [...rows];
      updatedRows[index] = { ...exampleRow};
      // while (updatedRows.length < 5) {
      //   updatedRows.push({ ...exampleRow });
      // }
      setRows(updatedRows);
    } catch (ex) {}
  };
  const handleManualRow = (e) => {
    try {
      e.preventDefault();
      setManual((prev) => !prev);
      document
        .getElementById(`prezzoBin_${index}`)
        .addEventListener("blur", () => {});
    } catch (ex) {}
  };

  return (
    <td className="flex gap-3 p-2">
      <button
        onClick={handleManualRow}
        className={`${
          manual ? "text-green-500" : "text-zinc-500"
        } p-2 rounded-lg border cursor-pointer`}
        title="Calcoli manuali"
      >
        <Hand />
      </button>
      <button
        onClick={handleDelete}
        className="text-red-500 p-2 rounded-lg border cursor-pointer"
        title="Elimina riga"
      >
        <Trash2 />
      </button>
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
