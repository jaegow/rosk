import React, {FC, Suspense, useEffect} from 'react';
import { getSubLogger } from "./utils/log";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createRoot } from "react-dom/client";

const sectionId = 'app';
const log = getSubLogger({ context: sectionId });

const ExamplePage = React.lazy(() => import('./feature/ExamplePage'));

const App: FC = () => {

    useEffect(() => {
        log.info('client starting up...')
    }, []);

    return (
        <>
            <Router>
                <React.StrictMode>
                    <Suspense fallback={<span>...loading...</span>}>
                        <Routes>
                            <Route path="/*" element={<ExamplePage foo="foo prop value" bar={123} />} />
                        </Routes>
                    </Suspense>
                </React.StrictMode>
            </Router>
        </>
    );
};

const container = document.getElementById('root') as HTMLDivElement;
const root = createRoot(container);
root.render(<App />);
