export function assignmentHTML({
    subject,
    grade,
    testDuration,
    maxMarks,
    sections,
}: any) {
    return `
<!DOCTYPE html>
<html>

<head>

<style>

body{
    font-family: Arial, sans-serif;
    padding:40px;
    color:#222;
}

.header{
    text-align:center;
    margin-bottom:20px;
}

.line{
    display:inline-block;
    border-bottom:1px solid black;
    width:180px;
}

.meta{
    display:flex;
    justify-content:space-between;
    margin-top:20px;
}

.section-title{
    text-align:center;
    font-size:22px;
    margin-top:40px;
}

.question{
    margin-top:15px;
}

.small{
    font-size:13px;
    color:#666;
}

</style>

</head>

<body>

<div class="header">

<h1>Assignment Paper</h1>

<h2>${subject}</h2>

<h3>Class: ${grade}</h3>

</div>

<div class="meta">

<div>Time Allowed: ${testDuration} minutes</div>

<div>Maximum Marks: ${maxMarks}</div>

</div>

<br>

<div>
Name:
<span class="line"></span>
</div>

<div>
Roll Number:
<span class="line"></span>
</div>

<div>
Class:
${grade}
Section:
<span class="line"></span>
</div>

${(sections ?? []).map(
        (section: any) => `
<h2 class="section-title">${section.sectionName}</h2>

<h3>${section.title}</h3>

<p>${section.instruction}</p>

${section.questions.map((q: any, index: number) => `<div class="question">

${index + 1}. [${q.difficulty}] ${q.text}

${
  q.type === "mcq" &&
  Array.isArray(q.options)
    ? `
      <ul>
        ${q.options
          .map(
            (option: string) => `<li>${option}</li>`
          )
          .join("")}
      </ul>
    `
    : ""
}

<div class="small">
[${q.marks} Marks]
</div>

</div>
`).join("")}
`).join("")}

</body>

</html>
`;
}