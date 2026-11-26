import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import "./EditorComunicado.css";

function IconeAlinhamento({ tipo }) {
  if (tipo === "center") {
    return (
      <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
        <line x1="3" y1="4.5" x2="15" y2="4.5" />
        <line x1="5" y1="9" x2="13" y2="9" />
        <line x1="3.5" y1="13.5" x2="14.5" y2="13.5" />
      </svg>
    );
  }
  if (tipo === "right") {
    return (
      <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
        <line x1="3" y1="4.5" x2="15" y2="4.5" />
        <line x1="6.5" y1="9" x2="15" y2="9" />
        <line x1="4.5" y1="13.5" x2="15" y2="13.5" />
      </svg>
    );
  }
  if (tipo === "justify") {
    return (
      <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
        <line x1="3" y1="4.5" x2="15" y2="4.5" />
        <line x1="3" y1="9" x2="15" y2="9" />
        <line x1="3" y1="13.5" x2="15" y2="13.5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
      <line x1="3" y1="4.5" x2="15" y2="4.5" />
      <line x1="3" y1="9" x2="11.5" y2="9" />
      <line x1="3" y1="13.5" x2="13.5" y2="13.5" />
    </svg>
  );
}

function IconeLista({ ordenada = false }) {
  if (ordenada) {
    return (
      <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
        <line x1="7" y1="5" x2="15" y2="5" />
        <line x1="7" y1="9" x2="15" y2="9" />
        <line x1="7" y1="13" x2="15" y2="13" />
        <path d="M3 5.5h1.5V3.5M3 9.5h1.5M3 13.5h1.5" strokeWidth="1.5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
      <circle cx="3.8" cy="5" r="1" fill="currentColor" stroke="none" />
      <circle cx="3.8" cy="9" r="1" fill="currentColor" stroke="none" />
      <circle cx="3.8" cy="13" r="1" fill="currentColor" stroke="none" />
      <line x1="7" y1="5" x2="15" y2="5" />
      <line x1="7" y1="9" x2="15" y2="9" />
      <line x1="7" y1="13" x2="15" y2="13" />
    </svg>
  );
}

function EditorComunicado({ valor = "", aoAlterar, placeholder = "Digite o conteúdo do comunicado" }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: valor || "",
    onUpdate: ({ editor: instancia }) => {
      aoAlterar?.(instancia.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const htmlAtual = editor.getHTML();
    if (valor && valor !== htmlAtual && editor.isEmpty) {
      editor.commands.setContent(valor, false);
    }
  }, [editor, valor]);

  if (!editor) return null;

  function impedirPerdaFoco(evento) {
    evento.preventDefault();
  }

  return (
    <div className="bloom-editor-comunicado">
      <div
        className="bloom-editor-toolbar"
        role="toolbar"
        aria-label="Formatação do corpo do comunicado"
      >
        {/* Níveis de título e texto normal */}
        <div className="bloom-editor-grupo">
          <button
            type="button"
            title="Texto normal"
            className={editor.isActive("paragraph") ? "estado-ativo" : ""}
            onMouseDown={impedirPerdaFoco}
            onClick={() => editor.chain().focus().setParagraph().run()}
          >
            Normal
          </button>
          <button
            type="button"
            title="Título principal"
            className={editor.isActive("heading", { level: 1 }) ? "estado-ativo" : ""}
            onMouseDown={impedirPerdaFoco}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          >
            H1
          </button>
          <button
            type="button"
            title="Título secundário"
            className={editor.isActive("heading", { level: 2 }) ? "estado-ativo" : ""}
            onMouseDown={impedirPerdaFoco}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            H2
          </button>
          <button
            type="button"
            title="Subtítulo"
            className={editor.isActive("heading", { level: 3 }) ? "estado-ativo" : ""}
            onMouseDown={impedirPerdaFoco}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            H3
          </button>
        </div>

        {/* Estilos de texto */}
        <div className="bloom-editor-grupo">
          <button
            type="button"
            title="Negrito"
            className={`bloom-editor-btn-negrito${editor.isActive("bold") ? " estado-ativo" : ""}`}
            onMouseDown={impedirPerdaFoco}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            B
          </button>
          <button
            type="button"
            title="Itálico"
            className={`bloom-editor-btn-italico${editor.isActive("italic") ? " estado-ativo" : ""}`}
            onMouseDown={impedirPerdaFoco}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            I
          </button>
          <button
            type="button"
            title="Sublinhado"
            className={`bloom-editor-btn-sublinhado${editor.isActive("underline") ? " estado-ativo" : ""}`}
            onMouseDown={impedirPerdaFoco}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            U
          </button>
        </div>

        {/* Alinhamento */}
        <div className="bloom-editor-grupo">
          <button
            type="button"
            title="Alinhar à esquerda"
            className={editor.isActive({ textAlign: "left" }) ? "estado-ativo" : ""}
            onMouseDown={impedirPerdaFoco}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          >
            <IconeAlinhamento tipo="left" />
          </button>
          <button
            type="button"
            title="Centralizar"
            className={editor.isActive({ textAlign: "center" }) ? "estado-ativo" : ""}
            onMouseDown={impedirPerdaFoco}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          >
            <IconeAlinhamento tipo="center" />
          </button>
          <button
            type="button"
            title="Alinhar à direita"
            className={editor.isActive({ textAlign: "right" }) ? "estado-ativo" : ""}
            onMouseDown={impedirPerdaFoco}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          >
            <IconeAlinhamento tipo="right" />
          </button>
          <button
            type="button"
            title="Justificar"
            className={editor.isActive({ textAlign: "justify" }) ? "estado-ativo" : ""}
            onMouseDown={impedirPerdaFoco}
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          >
            <IconeAlinhamento tipo="justify" />
          </button>
        </div>

        {/* Listas e limpar formatação */}
        <div className="bloom-editor-grupo">
          <button
            type="button"
            title="Lista com marcadores"
            className={editor.isActive("bulletList") ? "estado-ativo" : ""}
            onMouseDown={impedirPerdaFoco}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <IconeLista />
          </button>
          <button
            type="button"
            title="Lista numerada"
            className={editor.isActive("orderedList") ? "estado-ativo" : ""}
            onMouseDown={impedirPerdaFoco}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <IconeLista ordenada />
          </button>
          <button
            type="button"
            title="Limpar formatação"
            onMouseDown={impedirPerdaFoco}
            onClick={() =>
              editor.chain().focus().unsetAllMarks().clearNodes().run()
            }
          >
            Tx
          </button>
        </div>
      </div>

      <div
        className="bloom-editor-area"
        onClick={() => editor.chain().focus().run()}
      >
        <EditorContent editor={editor} className="bloom-editor-conteudo" />
      </div>
    </div>
  );
}

export default EditorComunicado;