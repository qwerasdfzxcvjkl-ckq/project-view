pandoc static/project.md -t html --strip-comments --standalone=false -o build/project.html &&
sed "/<!-- PROJECT_MD_HTML -->/{
  r build/project.html
  d
}" static/prebuild.html > index.html
