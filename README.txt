Prerequisiti
    Node.js (16+) e npm (8+) installati localmente
    Non serve installare React, PapaParse o Recharts globalmente: sono dichiarati come dipendenze e verranno scaricati con npm install.

Installazione e avvio
    1.Clona il repository
        git clone <URL_DEL_TUO_REPOSITORY>
        cd <CARTELLA_DEL_PROGETTO>

    2.Installa le dipendenze (includendo React, PapaParse e Recharts)
        npm install

    3.Verifica la posizione del file CSV
        Assicurati che il file 4-sleep_data_2025-02-11.csv sia in src/data/.

    4.Controlla che le Librerie siano le seguenti:
        Librerie necessarie:
        ├── @eslint/js@9.22.0
        ├── @types/papaparse@5.3.15         <----
        ├── @types/react-dom@19.0.4
        ├── @types/react@19.0.11
        ├── @vitejs/plugin-react-swc@3.8.0
        ├── eslint-plugin-react-hooks@5.2.0
        ├── eslint-plugin-react-refresh@0.4.19
        ├── eslint@9.22.0
        ├── globals@15.15.0
        ├── papaparse@5.5.2                 <-----
        ├── react-dom@19.0.0
        ├── react@19.0.0
        ├── recharts@2.15.1                 <-----
        ├── typescript-eslint@8.26.1
        ├── typescript@5.7.3
        └── vite@6.2.2

    5.Avvia il server di sviluppo
        npm run dev

    