import { h, render } from "preact";
import {
  useState,
  useEffect,
  // useReducer,
  useErrorBoundary,
} from "preact/hooks";
import {
  FileDirectoryIcon,
  FilterIcon,
  FileIcon,
  WorkflowIcon,
  InfoIcon,
  XCircleIcon,
} from "@primer/octicons-react";
// import { createMachine, assign } from "xstate";
// import { useMachine } from "@xstate/react";
import * as io from "./io";
import "./app.scss";

// interface ToggleContext {
//   count: number;
// }

// const toggleMachine = createMachine<ToggleContext>({
//   id: "toggle",
//   initial: "inactive",
//   context: {
//     count: 0,
//   },
//   states: {
//     inactive: {
//       on: { TOGGLE: "active" },
//     },
//     active: {
//       entry: assign({ count: (ctx) => ctx.count + 1 }),
//       on: { TOGGLE: "inactive" },
//     },
//   },
// });

function reducer(state, action) {}

function App() {
  const [fatalError, resetFatalError] = useErrorBoundary();

  const [err, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<string | null>("Ready");

  const [folder, setFolder] = useState<{ path: string } | null>(null);

  const [files, setFiles] = useState<Array<{ name?: string; path: string }>>(
    []
  );

  const [file, setFile] = useState<null | { name?: string; path: string }>(
    null
  );

  const [contents, setContents] = useState<{ contents: null | string }>({
    contents: null,
  });

  useEffect(function onLoad() {
    const effect = async () => {
      const { lastDirectory } = await io.loadConfig();
      if (lastDirectory) {
        setFolder({ path: lastDirectory });
      }
    };
    effect();
  }, []);

  useEffect(
    function folderChange() {
      const effect = async () => {
        if (!folder?.path) return;
        const dirFiles = await io.loadFolder(folder.path).catch(setError);
        if (dirFiles) {
          setFiles(dirFiles);
          io.saveConfig({ lastDirectory: folder.path });
          setStatus("Opened folder");
        }
      };
      effect();
    },
    [folder]
  );

  useEffect(
    function fileChange() {
      console.log({ file });
      const effect = async () => {
        setStatus("Opening file");
        if (!file?.path) return;
        const fileContents = await io.loadFile(file.path).catch(setError);
        if (fileContents != null) {
          setContents({ contents: fileContents });
          setStatus("Viewing file");
        }
      };
      effect();
    },
    [file]
  );

  const pickFolder = async () => {
    const folderPath = await io.pickFolder();
    setFolder({ path: folderPath });
  };

  if (fatalError) {
    return (
      <div class="notification is-danger">
        {fatalError.message}{" "}
        <button class="button is-small" onClick={resetFatalError}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="App is-flex is-flex-direction-column">
      <div className="p-2 is-flex is-flex-wrap-reverse">
        <div className="is-flex-shrink-1 is-flex-grow-1">
          <span className="icon-text">
            <span className="has-text-info icon">
              <WorkflowIcon />
            </span>{" "}
            <span className="has-text-dark is-size-7">
              <strong>{folder?.path}</strong>
            </span>
          </span>
        </div>
        <div className="is-flex-grow-0 is-flex-shrink-0">
          <div className="buttons are-small">
            <button class="button has-text-grey-dark" onClick={pickFolder}>
              <FileDirectoryIcon aria-label="Change folder" />
            </button>
          </div>
        </div>
      </div>

      <div class="is-flex-grow-1 is-flex is-flex-direction-row is-flex-wrap-nowrap p-1">
        <div className="is-flex-grow-0 is-flex-shrink-0 p-2 m-1 FileList">
          <p class="control has-icons-left">
            <input class="input is-info" type="text" placeholder="Search" />
            <span class="icon is-left">
              <FilterIcon />
            </span>
          </p>
          <div class="py-4">
            {files &&
              files.map((f) => {
                return (
                  <div
                    class="p-2"
                    tabIndex="0"
                    onFocus={() => {
                      // TODO: throttle calls
                      if (!f?.path) return;
                      setStatus("Opening " + f.path);
                      setFile(f);
                    }}
                  >
                    <span class="icon">
                      <FileIcon />
                    </span>
                    {f.name}
                  </div>
                );
              })}
          </div>
        </div>
        <div className="is-flex-grow-1 is-flex-shrink-1 p-2 m-1">
          <div className="FilePanel">
            <div className="card p-4">
              {file != null ? (
                <div>
                  <h2 class="title">{file?.name}</h2>
                  <div className="content">{contents.contents}</div>
                </div>
              ) : (
                "No file selected"
              )}
            </div>
          </div>
        </div>
      </div>

      <nav className="level p-2 is-size-7">
        <div className="level-left">
          {err && (
            <span className="icon-text">
              <span className="has-text-danger icon">
                <InfoIcon />
              </span>{" "}
              <span className="has-text-dark">
                <strong>{err?.message}</strong>{" "}
              </span>
            </span>
          )}
          <span className="has-text-dark">{status}</span>
        </div>
        <div class="level-right">
          {err && (
            <button
              class="button is-small is-white is-rounded"
              onClick={() => setError(null)}
            >
              <XCircleIcon aria-label="Clear" />
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}

render(<App />, document.body);
