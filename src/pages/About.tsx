export function About() {
  return (
    <section className="about">
      <h1>About</h1>
      <p>
        Star Wars Explorer is a small training application built for the
        <a
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noreferrer"
        >
          {' '}
          Rolling Scopes School React course
        </a>
        . It demonstrates routing, hooks, pagination, and master-detail layouts
        with React Router.
      </p>
      <p>
        <strong>Author:</strong> azamxvit
      </p>
      <p>
        Source:
        <a
          href="https://github.com/rolling-scopes-school/tasks/tree/master/react"
          target="_blank"
          rel="noreferrer"
        >
          {' '}
          RS School React tasks
        </a>
        .
      </p>
    </section>
  );
}
