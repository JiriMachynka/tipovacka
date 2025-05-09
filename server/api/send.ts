import { Resend } from 'resend';

export default defineEventHandler(async (event) => {
	const queryParams = getQuery(event);
	const { to, cc, category, description, email, username, playerId, myEmail } = queryParams;
	const { resendApiKey } = useRuntimeConfig(event);

	const resend = new Resend(resendApiKey);

	const authorEmailPromise = resend.emails.send({
		from: 'Admin Tipovačka <admin@moje-tipovacka.cz>',
		to: to as string,
		cc: cc as string | undefined,
		subject: 'Potřebuju pomoct',
		html: `
        <p>Typ: ${category}</p>
        <p>Popis: ${description}</p>
      `,
	});

	const founderEmailPromise = resend.emails.send({
		from: 'Admin Tipovačka <admin@moje-tipovacka.cz>',
		to: myEmail as string,
		subject: 'Potřebuju pomoct',
		html: `
				<p>Hráč: ${username}</p>
				<p>Email: ${email}</p>
				<p>Player ID: ${playerId}</p>
        <p>Typ: ${category}</p>
        <p>Popis: ${description}</p>
      `,
	});

	const [{ error }] = await Promise.all([authorEmailPromise, founderEmailPromise]);

	if (error) {
		return error;
	}
});
