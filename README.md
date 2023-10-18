# Biography-Multilingual-Question-Answering-Chatbot

## Description 
---------------
The project presents the approach for developing the QA system, including data collection, preprocessing, translation from Malay to English, and model selection. Several models, including Sentence Transformers and BM25 retriever, are utilized for question answering. The performance of the system is evaluated using a diverse set of questions about biographies in the Malaysian language.

## Methods & Results 
------------
### Data Collection
A total of 110 biographies are collected from Wikipedia in the Malay language. A library known as ‘wikipedia’ is downloaded to assist in extracting the texts from the wikipedia. Web scraping is used to get the texts from wikipedia and save it into .txt format. The figure below displays a sample of the text in Malay language.

![image](https://github.com/eethiing/Biography-Multilingual-Question-Answering-Chatbot/assets/85276977/a31a80f9-6922-4343-8aff-a9d750f3d1d7)

### Data Pre-processing 
The first preprocessing is based on Haystack library. When the clean_empty_lines is set to True, the text should be cleaned up of any empty lines. Lines that do not have text or whitespace are known as empty lines. Clean_whitespace will remove extra whitespaces such as multiple continuous spaces or tabs and clean_header_footer is used to remove common examples of unnecessary materials included in header or footer sections such as page numbers. Split_by word specifies the method for breaking up long sentences. In this case, the parameter is set to ‘word’ which implies that the long texts will be divided into smaller portions based on the words. Split_length implies the maximum length for each split. When the split_respect_sentence_boundary is set to True, the splitting will make an effort to divide the text along the borders of sentences, making sure that each chunk contains a whole sentence. This contributes to preserving the context. Since Haystack has limited pre-processing functionalities, we added some extra pre-processing steps such as tokenization, removing punctuations, and replacing ‘/n’  with space.

### Document Translation From Malay to English
Several models were experimented with for translating documents from Malay to English. This translation was necessary because most pre-existing models perform optimally in English compared to Malay. Model 4 was selected as the results were comparable. 

Original Content : Marilyn Monroe (lahir Norma Jeane Mortenson pada 1 Jun 1926 – meninggal pada 4 Ogos 1962) merupakan seorang pelakon wanita, peragawati, penyanyi serta ikon Hollywood.Terkenal dengan melakon sebagai watak blomb bombshell, beliau ialah simbol seks Amerika Syarikat.Beliau pernah meraih Anugerah Golden Globe.Beliau terkenal kerana kemahiran komedi beliau dan ketrampilan beliau dalam layar.Monroe menjadi salah seorang bintang filem paling popular pada 1950-an dan awal 1960-an.Pada peringkat-peringkat lanjut dalam kerjaya beliau, beliau cenderung kepada peranan-peranan yang lebih serius dan namanya memintas nama-nama semua penghibur lain pada masa itu.Kematian beliau secara tiba-tiba dikelaskan sebagai "barangkalinya bunuh diri." Kebanyakan individu termasuk Jack Clemmons, pegawai polis LAPD pertama yang tiba di tempat kematian percaya bahawa beliau telah dibunuh. Beliau merupakan satu-satunya wanita dalam senarai selebriti sudah meninggal yang paling banyak pendapatannya oleh Forbes.

|No. | Translation Models | Translated Document In English | 
| ---| -------------| -----------------|
| 1 | mesolitica/finetune-translation-t5-super-super-tiny-standard-bahasa-cased | In his career, he tends to be more serious roles and his name asked the names of all other entertainers at the time.In his career, he tends to be more serious roles and his name asked the names of all |
|2 | deepset/roberta-base-squad2 | 'Marilyn Monroe was born on June 1, 1926. She died on June 4, 1962 as Mrs. Ogos 1962.', "His sudden death was classified as 'perhaps suicide'. '', including Jack Clemmons, the first police officer to come to death, believes that he was murdered. She is the only woman in the list of stars he deserves most." |
|3| mesolitica/finetune-noisy-translation-t5-tiny-bahasa-cased-v2 | Monroe became one of the popular movie stars in 1950-an and early 1960-an. At the further stages in his career, he tends to more serious role-peranan and his name is asking for the names of all other entertainers at the time. She once won Golden Globe Award. She is famous for her comedy skills and her intelligence in screen. Monroe became one of the popular movie stars in 1950-an and early 1960-an. At the further stages in his career, he tends to more serious roles and his name is asking for the names of all other entertainers at the time. | 
|4 | Helsinki-NLP/opus-mt-ms-de & Helsinki-NLP/opus-mt-de-en | Marilyn Monroe was born on June 1, 1926. She died on June 4, 1962 as Mrs. Ogos 1962. His sudden death was classified as 'perhaps suicide'. '', including Jack Clemmons, the first police officer to come to death, believes that he was murdered. She is the only woman in the list of stars he deserves most.|

### Models 

The selected model for the system is ‘multi-qa-MiniLM-L6-cos-v1’ together with Sentence Transformer. The table below shows a sample output. 

| Model | Question | Answer |
| ---- | ---- | --- | 
| SentenceTransformer('multi-qa-MiniLM-L6-cos-v1') | Bila Barack Obama lahir? | Barack Xavier Obama II was born 4 Ogos in 1961, which shows Jawi that he was appointed President of the United States on November 16, 2008. He became the first African president of America and the first to be born in Hawaii. Obama was the young senator of Illinois before he was born on June 16, 1961. |

### Multi-lingual Question Answering 

To incorporate multi-lingual question answering, the Helsinki Huggingface models for french, german and italian languages have been utlised whereas for the malay language, the pretrained english to malay model from the Malaya website have been used.

| Language | Question | Answer |
| ---- | ---- | --- | 
| Malay | Siapakah David Beckham? | David Robert Beckham OBE, lahir 2 Mei 1975, adalah bekas pemain bola sepak Ingerists. | 
| English |  What happened to Abraham Lincoln? | Lincoln laid down conditions to restore his own empire in the rebellious countries. On April 9, 1865, Lincoln, the leading general, Robert E., sat on April 11, 1865, in which he promoted the right to an auction for blacks. On April 14, 1865, Lincoln entered the theater to see the victims of "Our American Cous". | 
| French | Quand est né Brad Pitt? (When was Brad Pitt born?) | William Brad Pitt est né le 18 décembre 1963, ou William Bradley Pitt est un philosophe américain né le 18 décembre 1963 à Shawnee, en Oklahoma. ( William Brad Pitt was born on December 18, 1963, or William Bradley Pitt was an American philoner born on December 18, 1963 in Shawnee, Oklahoma.) | 
| German |Wer ist Donalds Trump-Frau? (Who is Donald Trump’s wife?) | Die beiden trennten sich 1997 und ließen sich 1999 scheiden. 1998 hatte Trump das slowenische Model Melanie Knavs kontaktiert, die seine dritte Frau war. (The two separated in 1997 and divorced in 1999. In 1998 Trump had contacted the Slovenian model Melanie Knavs, who was his third wife.) | 
| Italian | Quale premio ha vinto Cristiano Ronaldo? (What award did Cristiano Ronaldo win?) | Nel 2015, Ronaldo è stato nominato esperto mondiale di raccolta fondi dopo aver donato 5 milioni di sterline al terremoto in Nepal, che ha costato più di 8.000 persone. Nel giugno 2016, Ronaldo ha donato il premio dei Campionati Europei per 600.000 euro dopo la vittoria del Real Madrid. Nel 2015 Ogos ha lanciato un album 2016 CR7 Sevenfire app che ha aiutato i partecipanti ad aiutarlo nel suo lavoro. (In 2015, Ronaldo was named the world's fundraising expert after donating £5 million to the Nepal earthquake, which cost more than 8,000 people. In June 2016, Ronaldo donated the European Championships prize for €600,000 after Real Madrid won the European League victory. In 2015, Ogos launched a 2016 CR7 Sevenfire album app that helped the participants to help him in his work.) | 
