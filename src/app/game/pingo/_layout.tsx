import Background from '@/components/Background'

export default function PingoLayout({
	children,
   }: {
	children: React.ReactNode;
   }) {
	return (
		<Background>{children}</Background>
	);
   }
   