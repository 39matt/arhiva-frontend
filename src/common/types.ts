interface ILoginFormInput {
  email: string;
  password: string;
}

interface IRegisterFormInput {
  ime: string;
  prezime: string;
  nadimak: string;
  email: string;
  telefon: string;
  sifra: string;
  potvrdiSifru: string;
  potvrdiEmail: string;
}

interface IDodajPredmetFormInput {
  name: string;
  code: string;
  espb: number;
}

interface IUnaprediKorisnikaFormInput {
  username: string;
}

interface IDodajPredmetNaSmeruFormInput {
  courseCode: string;
  majorCode: string;
  year: number;
}

interface IDodajBlanketFormInput {
  courseCode: string;
  term: string;
  year: string;
  type: string;
  document: FileList;
}

interface IDodajResenjeFormInput {
  document: FileList;
}

interface IDodajDatumFormInput {
  date: string;
}

interface IIzmeniKorisnika {
  ime: string;
  prezime: string;
  nadimak: string;
  email: string;
  brojTelefona: string;
}

interface IPromeniLozinku {
  staraLozinka: string;
  novaLozinka: string;
  potvrdiNovuLozinku: string;
}
interface Smer {
  num: number;
  name: string;
  img: string;
  code: string;
}

interface Predmet {
  name: string;
  code: string;
  espb: number;
  kolokvijum1Date: Date;
  kolokvijum2Date: Date;
  ispitDate: Date;
  followers: string[];
}

interface User {
  name: string;
  surname: string;
  username: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string;
  karma: number;
}

interface Blanket {
  id: string;
  courseCode: string;
  year: string;
  term: string;
  type: string;
  documentUrl: string;
  approved: boolean;
  likes: number;
  uploadedBy: string;
}
interface Resenje {
  id: string;
  blanketId: string;
  approved: boolean;
  solutionUrl: string;
  num: number;
}

interface Komentar {
  postedById: string;
  postedOnId: string;
  content: string;
}
