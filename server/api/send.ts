import { Resend } from 'resend';

export default defineEventHandler(async (event) => {
	const queryParams = getQuery(event);
	const { to, cc, category, description } = queryParams;
	const { resendApiKey } = useRuntimeConfig(event);

	const resend = new Resend(resendApiKey);

	const { error } = await resend.emails.send({
		from: 'Admin Tipovačka <admin@moje-tipovacka.cz>',
		to: to as string,
		cc: cc as string | undefined,
		subject: 'Potřebuju pomoct',
		html: `
        <p>Typ: ${category}</p>
        <p>Popis: ${description}</p>
      `,
	});

	if (error) {
		return error;
	}
});
