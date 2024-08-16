import { config } from 'dotenv';
config();

// export const serviceAccount : {
//     type: process.env.TYPE,
//     project_id: process.env.PROJECT_ID,
//     private_key_id: process.env.PRIVATE_KEY_ID,
//     private_key: process.env.PRIVATE_KEY,
//     client_email: process.env.CLIENT_EMAIL,
//     client_id: process.env.CLIENT_ID,
//     auth_uri: process.env.AUTH_URI,
//     token_uri: process.env.TOKEN_URI,
//     auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
//     client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
//     universe_domain: process.env.UNIVERSE_DOMAIN,
// };




export const serviceAccount = {
    type: "service_account",
    project_id: "pep-authentication",
    client_id: "105334337913382652567",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-sqajy%40pep-authentication.iam.gserviceaccount.com",
    UNIVERSE_DOMAIN: "googleapis.com",
    private_key_id: "2e82c9872bd548b2694c9f8ca1d96d0bd7277278",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCzPpRqpAn4TqC8\nVjyhw+kYcho+0+ijporUWTQgFbsHMSzeY/Ud8Wln5ibHipTdR3QaS7KjzC8HDdJJ\nPmYjbgkptp8I+LmMV4tMfF+K1ZKmqlkUbjMEayvbqT4OW5U2hNzSSS6UiutSdsKV\nYsek8seMz5d9571roRTg9c3hWJbLEL1/CCQMpCvxexUOuQGUOU4WLP0lTOJOlp8Q\nRq2Q/IVVu5cYQUTwUc3a7JVRPcz2ljksyLfoLym6/3200zzmnAjQDRyrToBF1Bt6\n/ytDAEtImOA6a+lpv4uxrvSQZ+P949DGt+BNGNglljfW+c86hoKMxQSsUYJcqxyy\nqCKotvshAgMBAAECggEAVEXFaNgEGfr5xmKzMgkWhBhNb6GY/Kw2FH12LOmam9iK\ndGrBmVjhymgibmmg8OKB20Ug0bMTnzjn1+jfA6Rd6X9DiWfLcQjN5OGK2A7u2q43\noIvpL5glsCqDkyOK5W2VFscyf8NKvWQ5uxuMqug8Wt9VJex5GevLkbLvn5XTm9fQ\n7a1pC/RP2ApjbffRCDBuxO++I6CKnqxe6IRVSKjMFlR1WVuvT74MrkCRoQ1XKuSm\ndpKQqP2mavs8gLjYTtVN8kN3qYeNAT1t2bkcfLjYHp9pSR4THvJeprDlonisl/St\ngsNWnYuEEaS496P0Y8oRK94AIbDNwv4PuIumc/+7OwKBgQD4GA0Nhe55zb7dLIq0\nylAcCPLoc1jiXNwpiQQb0TyEvrU/CKlHShxbM/G+MZ2y2At1H4BGaxWbXBnitmPz\nzp7NEvNGQeOqeFfLWfbt6r8kqCa1tp2JDGWsJpzdsDQ6vye0VB+7RhzNvdlMiZYz\nbqKPZ+5KQO56wPusz5tysMYQywKBgQC49Nre4eP6oHDtt2QXlywdfVsW0rlJeagZ\n57nUHJyD86D/ZnYGZxVWPD2nE1ZwTK39eRQ5Prwq0cEB57q2WtqE1a16GR2c/O03\n1qGr9XpzVFMtQ8IthqB5+kw/v+ix05N3lQEkWeNSjJZK+USeSXNBj/9+Mv+zNbXi\n/lwtXV0CQwKBgQDelzWe3HuKbT7B0iTg8GPPw3etd1BYSFiAK560FpblwvV7CJpY\ni/XFHmXW700+GPiurQS6KXnJWmkfL+Wd6dQwyr/aWWOanz6mBKG39NZqXTPd9WqC\ne8z9F+fGP0GdM8S71n5h2BYfwiYktY09uBXB9M2ncXqGSH+GHP6reE884QKBgQCX\nBdBF1/s4pZMwd+Ox441xEu+y5iPHXCAn7u/sw+QFVoSqpvZOahOhE5Vf/ElDb0lO\nxHP//jrVV+qabKYnym3Ns1Bwd1uX2Wq1gnsGl24CB+PW/RHr7JbSos9p6oDN2y35\noeCJ1x/oQsVhuMIP4XfMHBGJ8Yiaw4ueKwYHQMn2UwKBgATGC8sTDNrk+HetzAuX\npzvw+HdX2uMY0DRqchQlHCS2rsZVEFhLOBevYmpShAlhAdskhAqzup6Dep36I03j\nc02hREuh9U17PVPkPpBFeq+VT6t50OY15u2gWmxTbHAvX1bzI/kTGpf6ihKwun9H\ni8GqsgAUhXIDSf2xdCjwxGE9\n-----END PRIVATE KEY-----\n",
    client_email: "firebase-adminsdk-sqajy@pep-authentication.iam.gserviceaccount.com",

}
