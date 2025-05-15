import { Editor } from "@tinymce/tinymce-react";

const Description: React.FC = () => {
  return (
    <div className="mt-4 ml-10">
      <Editor
        apiKey="a5eehweab0y5sl2d379firrdrmvqreznvtdyd7utpw97vidl"
        init={{
          content_style: `
          body {
           font-family: Helvetica, Arial, sans-serif;
           font-size: 14px;
           padding: 15px;
           background-color: #22272B;
           color: #fff;
          }
          p {
           margin: 0 0 1em;
           }`,
          height: 300,
          plugins: [
            "anchor",
            "autolink",
            "charmap",
            "codesample",
            "emoticons",
            "image",
            "link",
            "lists",
            "media",
            "searchreplace",
            "table",
            "visualblocks",
            "wordcount",
            // Your account includes a free trial of TinyMCE premium features
            // Try the most popular premium features until May 29, 2025:
            "checklist",
            "mediaembed",
            "casechange",
            "formatpainter",
            "pageembed",
            "a11ychecker",
            "tinymcespellchecker",
            "permanentpen",
            "powerpaste",
            "advtable",
            "advcode",
            "editimage",
            "advtemplate",
            "mentions",
            "tinycomments",
            "tableofcontents",
            "footnotes",
            "mergetags",
            "autocorrect",
            "typography",
            "inlinecss",
            "markdown",
            "importword",
            "exportword",
            "exportpdf",
          ],
          toolbar:
            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
          tinycomments_mode: "embedded",
          tinycomments_author: "Author name",
          mergetags_list: [
            { value: "First.Name", title: "First Name" },
            { value: "Email", title: "Email" },
          ],
        }}
        initialValue="Start typing"
      />
    </div>
  );
};

export default Description;
