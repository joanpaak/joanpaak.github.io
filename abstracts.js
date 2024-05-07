/* 

<abstract>
<title></title>
<language></language>
<tags></tags>
<text>
</text>
<link></link>
<image></image>
</abstract>
*/

let abstractsNotYetPublished = `

<abstract>
<title>Sequential Importance Sampling with rejuvenation from KDE</title>
<language>English</language>
<tags>statistics, bayes, mcmc</tags>
<text>
</text>
<link></link>
<image></image>
</abstract>


<abstract>
<title>A novel algorithm for finding the prime form of a pitch class set</title>
<language></language>
<tags></tags>
<text>
</text>
<link></link>
<image></image>
</abstract>



<abstract>
<title>Fitting ROEX filters in the presence of measurement error</title>
<language></language>
<tags>psychology, statistics, bayes</tags>
<text>
Auditory filtering is often studied by measuring detection thresholds for notched noise maskers.

After detection thresholds for various notch widths have been measured, one basically fits a curve of predicted thresholds to the data points, usually assuming Gaussian errors. The model, then, is essentially non-linear Gaussian regression.

The problem that I'm tackling in this text is that this does not take into account the fact that we can't measure detection thresholds exactly; as a matter of a fact, there is usually considerable posterior uncertainty associated with measured thresholds measured using standard procedures (e.g. 2AFC or 3AFC).

I'll be comparing standard models which assume no measurement error with models that take posterior uncertainty in thresholds into account.
</text>
<link></link>
<image>roexFig.png</image>
</abstract>

<abstract>
<title>Lidlin ruokakassin hinta</title>
<language>Suomi</language>
<tags>blather, methodology, critique</tags>
<text>
Lidl mainostaa suuria säästöjä, jos keskittää ruokaostoksensa heille. Tässä ei sinänsä ole mitään uutta, markkinointikikkana tämä on varsin tavanomainen.

Tuli kuitenkin katsottua, että millä oletuksilla tuo säästö on laskettu. Ja ne oletuksethan eivät järin realistisilta näytä! Säästöt on laskettu perustuen oletukseen, että ostoksia tekee maksamakkaraa kilotolkulla syövä ja WC-paperia rullakaupalla päivässä käyttävä henkilö.
</text>
<link></link>
<image>ruokakassi.png</image>
</abstract>

<abstract>
<title>Keski-Suomen hyvinvointialueen kysely</title>
<language>Suomi</language>
<tags>blather, methodology, critique</tags>
<text>
Minut pyydettiin mukaan tutkimukseen Keski-Suomen hyvinvointialueen keskittämiseksi. Osana tutkimusta sain vastata internetissä olevaan kyselyyn.

Ikävä kyllä tuo kysely oli toteutettu ala-arvoisesti.
</text>
<link></link>
<image>lomake.png</image>
</abstract>


<abstract>
<title>A view to conjugate priors: what is the beta distribution?</title>
<language></language>
<tags></tags>
<text>
</text>
<link></link>
<image>betaConjugacy.png</image>
</abstract>

`;

let abstracts = `



<abstract>
<title>ShortR: Bayesian adaptive estimation of threshold and slope</title>
<language>English</language>
<tags>psychology, statistics, bayes, methodology, shortR</tags>
<text>
In 1999 Kontsevich and Tyler published their now classic paper on Bayesian adaptive testing of the threshold and slope parameters of the pyschometric function, that is, function that relates, say, the intensity of an auditory stimulus to the probability that a participant in an experiment will detect it.

This adaptive algorithm tries to choose the stimulus intensities in a way that would maximize information gained about the aforementioned two parameters of the function.

Here I show how their algorithm, that uses grid approximation of the Baysian posterior probability densities, could be implemented in R.
</text>
<link>blathers/shortR/psyFunAdaptive/kontsevich_tyler_1999.html</link>
<image>infogainFig.png</image>
</abstract>

<abstract>
<title>Luottamusväli ei ole luottamusväli</title>
<language>Suomi</language>
<tags>statistics, elementary level</tags>
<text>
Luottamusvälit - mitähän ne nyt olivatkaan? No, en tässä tekstissä niinkään pureudu siihen, vaan käsittelen tässä yleistä virhekäsitystä, eli sitä, että 95 %:n luottamusväli tarkoittaa sitä, että populaation keskiarvo on 95 %:n todennäköisyydellä tuolla välillä.

Näkökulmanani on se, että todennäköisyys sille, että populaatioparametri on  tuolla välillä vaihtelee luottamusvälin pituuden mukaan. Ovatkohan ne lyhyet luottamusvälit sittenkään niitä tarkimpia?
</text>
<link>blathers/LuottamusvaliEiLuottamusvali/luottamusvaliEiLuottamusvali.html</link>
<image>luottamusvaliKuva.png</image>
</abstract>

<abstract>
<title>ShortR: Resample/Move particle filter</title>
<language>English</language>
<tags>statistics, bayes, shortR</tags>
<text>
A continuation on the Sequential Importance Sampling tutorial above. In this tutorial I will show, in R, how to implement the (special case of) a Resample/Move particle filter introduced by Chopin (2002).
</text>
<link>blathers/shortR/SIS_rejuvenation/SIS_rejuvenation.html</link>
<image>importanceSample.png</image>
</abstract>

<abstract>
<title>Variance inflation in KDE</title>
<language>English</language>
<tags>statistics, blather, beginner text</tags>
<text>We use kernel density all the time to summarize data sets, but did you know that the variance inferred from KDE is always larger than the variance of the data?

Well, if you didn't take a peek at this text. This is not a long one. 
</text>
<link>blathers/varianceInflationKDE/varianceInflationKDE.html</link>
<image>varianceInflationThumb.png</image>
</abstract>



<abstract>
<title>ShortR: Sequential Importance Sampling</title>
<language>English</language>
<tags>shortR, statistics, bayes, tutorial</tags>
<text>
Sequential Importance Sampling (SIS) consists of getting a random sample of "particles" from the prior distribution, and then sequentially weighting them once data arrive. In this demonstration I'll show how to do this for a simple model in which observations are generated from a normal distribution with unknown mean and standard deviation.
</text>
<link>blathers/shortR/SIS/SIS_gaussian.html</link>
<image>importanceSample.png</image>
</abstract>


<abstract>
<title>REPO: Bayesian 2x2 model for General Recognition Theory</title>
<language>English</language>
<tags>methodology, psychology, statistics, bayes</tags>
<text>
General Recognition Theory (GRT) is a multidimensional generalization of the Signal Detection Theory. Common packages for fitting GRT models use ML estimation and model selection has been limited to comparing different information criteria. Advantage of Bayesian modeling is that as we uncertainty in the parameters is quantified directly in the posterior probability distribution. It also allows for an easier building of e.g. multilevel models.

This model has been built using the Stan programming language. It is a two-dimensional model with 2 response categories on each dimension.
</text>
<link></link>
<image>genRecogFig.png</image>
</abstract>

<abstract>
<title>Bayesian one-sample t-test with known variance</title>
<language>English</language>
<tags>statistics, bayes, blather</tags>
<text>
Ah, the one-sample t-test with known variance! It's what many statistics text books begin with - or if they don't outright begin with it, it's among the first models discussed. Well, I'm being a bit misleading, since I will not discuss the one-sample t-test that's used in frequentist statistics but a Bayesian version of it. 

The point is to show how it can be conceptualized as a hierarchical model, which in turn can be understood as a measurement-error model, and the original model can be thought of as a special case in which measurement error is zero.
</text>
<link>blathers/NormalModelAsHierarchical/bayes_one_sample_t_test.html</link>
<image>measurementErrorFig.png</image>
</abstract>


<abstract>
<title>Approximating response probabilities in an mAFC task</title>
<language>English</language>
<tags>psychology, methodology</tags>
<text>
When applying the Gaussian Signal Detection Theory to an mAFC task (in which m > 2) the response probabilities don't have a closed form solution. Here, I will show a simple way of approximating response probabilities with polynomials. Since these polynomials -- once their coefficients are estimated -- can be evaluated directly, this allows for one to build relatively fast algorithms for estimating mAFC models. I will show an implementation of a Bayesian 3AFC model in Stan programming language.

This text assumes some familiarity with e.g. linear models, maximum likelihood estimation, and coding in R and Stan, even though not everything is required for understanding every part; it's slightly modular, so you can skip for example the Stan part if you are not familiar with the language.
</text>
<link>blathers/mAFC_polynomial_approximation/mafc_poly.html</link>
<image>mafcFig.png</image>
</abstract>

<abstract>
<title>Some Bayesian aspects of choosing sample size</title>
<language>English</language>
<tags>statistics, bayes, blather</tags>
<text>
"How big of a sample should I get", is a question people often times have. Statistics textbooks offer their simplistic heuristics, such as "you need at least 10 observations for a t-test, at least 50 for a regression" and so on.

In this brief text I discuss sample size from the viewpoint of information: we should not look only at the raw number of observations, but rather if the data actually informs us about the quantities of interest. This is an introductory text and meant more as food for thought than a complete guide. 
</text>
<link>blathers/SampleSizeAndInformation/sampleSizeInformation.html</link>
<image>infogainFig.png</image>
</abstract>


<abstract>
<title>Introduction to Parameter Transformations and Jacobians in Stan</title>
<language>English</language>
<tags>tutorial, statistics</tags>
<text>
Please read the text Introduction to Parameter Transformations before this, expecially if you are new to including Jacobians in your models.

In this introductory text I show how to sample from the Gamma(3, 1) distribution. The catch is that samples on the unconstrained scale are exponentiated, which requries one to correct for the stretching of the scale induced by the transformation.

How to correct for that stretching by hand? And when does one need to correct for it in Stan? In some situations Stan can correct for it automatically, and no correction is needed. This text hopefully clarifies when that is the case.
</text>
<link>blathers/LogTransformationStan/transformationsInStan.html</link>
<image>jacobianPerspective.png</image>
</abstract>

<abstract>
<title>Introduction to Parameter Transformations</title>
<language>English</language>
<tags>statistics, bayes, mcmc, beginner text</tags>
<text>
Statistical models sometimes contain parameter transformations, for example, if one is estimating a variance parameter, it is usually more convenient to actually estimate log standard deviation.

This introductory tutorial shows how to apply the log transformation in two contexts 1) optimization and 2) MCMC-sampling. 

In MCMC sampling one has to correct for the stretching/contracting of the scale induced by the transformation.
</text>
<link>blathers/LogTransformation/VeryShortIntroToParameterTransformations.html</link>
<image>parTrans.png</image>
</abstract>


<abstract>
<title>Jacobians in Action</title>
<language>English</language>
<tags>statistics, bayes</tags>
<text>
If you are not familiar with Jacobians, please read the texts "Introduction to Parameter Transformations" and "Introduction to Parameter Transformations and Jacobians in Stan" before this. 

In this text I show how to do Jacobian adjustments for a simple normal distribution model in which the standard deviation parameter is taken to be on the log scale. 

I also discuss when Jacobian adjustments are needed and when not. This is particularly important when using Stan, since in some cases it can perform the adjustments autamatically.
</text>
<link>blathers/JacobianNormalExample/jacobianNormalDist.html</link>
<image>jacobianPerspective.png</image>
</abstract>



<abstract>
<title>Basics of Frequency Selectivity</title>
<language>English</language>
<tags>psychology, general audience</tags>
<text>
Our inner ear automatically performs frequency analysis. This is (kind of) similar to how the eye can see differenct colours. Even though sound waves enter our ear as one "blob", the ear is able to attend to different frequencies, for example, to low and high frequencies.

There are, however, limits to this. If two frequencies are too close to each other, they interfere with each other. If you, for example, hear two tones that are close in frequency, you will hear a distinct "wobbling" effect. This is something that the theory of auditory filtering aims to describe.

This text is a simple introduction, intended for people with no prior experience in psychoacoustics.
</text>
<link>blathers/frequencySelectivity/intro_eng.html</link>
<image>eq.png</image>
</abstract>


<abstract>
<title>Practical introduction to ROEX filters in R</title>
<language>English</language>
<tags>psychology, elementary level</tags>
<text>
The tutorial "Basics of Frequency Selectivity" covered the basics of the frequency selectivity of the human auditory system on a conceptual level. 

Here, I will introduce the reader to the ubiquitous two-paramter ROEX filter that is often used as a model of the auditory filters that constitute the theoretical backbone of modeling the (frequency selectivity of the) inner ear. 

The subject is a bit mathy, but there are a lot of helpful visualizations for one to get an intuition for all of the formulae. I also show how to evaluate the formulas in R so you can get ahead and e.g. predict thresholds and fit models.
</text>
<link>blathers/ROEX_pr/roex_pr_eng.html</link>
<image>roexFig.png</image>
</abstract>


<abstract>
<title>Bayesian inference for the two-parameter ROEX filter</title>
<language>English</language>
<tags>psychology, statistics, bayes</tags>
<text>
This continues from "Practical introduction to ROEX filters in R" and is intended for readers who are already familiar with the basic concepts of defining likelihood functions, priors and have some experience with Stan and R. 

This is a very practical look into how to simulate data for an imaginary notched noice experiment and fit the simulated data with Stan using the two-parameter ROEX filter. 

As a bonus, I fit the model to a real dataset. 
</text>
<link>blathers/ROEX_pr/roex_pr_statistics.html</link>
<image>roexFig.png</image>
</abstract>


<abstract>
<title>Simple low-pass filter</title>
<language>English</language>
<tags>general audience</tags>
<text>
Sound can be filtered. For example, if you turn down the bass knob on your stereo, you are filtering low frequencies out of the sound that's playing. 

How does a digital filter work? This might seem outright esoteric, but it's surprisingly simple. The mathematics can be understood by anyone. 

In this short tesxt I'll show how to apply simple 1st order FIR or IIR filters to time series data (e.g. sound, temperature...). There are also visualizations to play with - yay. 
</text>
<link>blathers/simple_low_pass_filter/simple_low_pass.html</link>
<image>lowPassFig.png</image>
</abstract>

<abstract>
<title>Infraäänitutkimuksen kritiikki</title>
<language>Suomi</language>
<tags>critique, statistics, methodology, general audience</tags>
<text>
Tässä kirjoituksessa käsittelen 2020 julkaistua raporttia Tuulivoimaloiden infraääni ja terveys sekä siitä kirjoitettua YLE:n uutista kriittisesti. Mitä ongelmakohtia tutkimuksessa oli ja kuinka nämä on onnistuttu viestimään noissa kahdessa tekstissä, joiden tarkoituksena on toimia tiedonvälityskanavina tiedeyhteisön ulkopuolelle?

Näkemykseni on, että tutkimuksesta saatava tieto infraäänten vaikutuksesta on vähäistä, ja että YLE ei ole onnistunut viestimään tutkimuksen antia realistisesti.
</text>
<link>blathers/TuulivoimaKritiikki/tuulivoimakritiikki.html</link>
<image>tuulivoimala.png</image>
</abstract>


<abstract>
<title>Hyvärinen et al. kritiikki</title>
<language>Suomi</language>
<tags>critique, statistics, methodology, general audience</tags>
<text>
Hyvärinen et al. tutkivat musiikkituokioiden, ja musiikin tuottamiseen käytetyn signaalitien (digitaalinen/analoginen) vaikutusta kolmos- ja kutosluokkalaisten lasten vointiin. Konkreettisesti ilmaistuna heidän tutkimuskysymyksenään oli: jos lapsille suodaan hetken hengähdystauko, jonka aikana soitetaan musiikkia, onko väliä sillä, onko tuo musiikki digitaalista (mp3-muodossa) vai analogista (vinyylilevy)? 

Tässä tutkimuksessa, tai ainakin siinä, kuinka se on raportoitu, on paljon ongelmia: käyn näitä läpi tässä kriittisessä kirjoituksessani.
</text>
<link>blathers/HyvarinenKritiikki/hyvarinen_et_al_kritiikki.html</link>
<image>vinyyliFig.png</image>
</abstract>

<abstract>
<title>Vastaustodennäköisyydet mAFC-tehtävässä</title>
<language>Suomi</language>
<tags>psychology, methodology, tutorial</tags>
<text>
Vastaustodennäköisyyksien laskeminen pakkovalintakokeessa, jossa vaihtoehtoja on enemmän kuin kaksi, ei ole itsestäänsevää. Tässä tekstissä näytän yksinkertaisten noppaesimerkkien kautta mistä laskukaavat tulevat. Esimerkit on tehty R-ohjelmointikielellä.
</text>
<link>blathers/vastaustnmAFC/mAFC_intro_fin.html</link>
<image>mafcFig.png</image>
</abstract>

<abstract>
<title>Voiko ei-konjugaattinen priori olla parempi?</title>
<language>Suomi</language>
<tags>bayes, statistics, blather</tags>
<text>
Tässä lyhyessä kirjoituksessa käsittelen konjugaattiprioria binomiaalisen mallin kontekstissa. Puhun lyhyesti siitä, mistä beta-jakauman voimme kuvitella tulevan. 

Kirjoituksen agendana, tosin, on varsinaisesti puhua siitä, että vaikka konjugaattipriorit ovat ilahduttavan yhtenäisiä, ei tämä yhtenäisyys aina välttämättä ole toivottavaa. Käyn läpi psykologiassa laajalti käytettyä kaksoispakkovalintakoetta ja sitä, kuinka nimenomaan tuollaisella "ei-konjugaattisella" priorilla saamme parannettua malliamme.
</text>
<link>blathers/Konjugaattiprioreista/konjugaattiprioreista.html</link>
<image>betaConjugacy.png</image>
</abstract>

<abstract>
<title>Nummenmaa: Logistinen regressio</title>
<language>Suomi</language>
<tags>statistics, critique, general audience</tags>
<text>
Lauri Nummenmaan tilastollisia menetelmiä käsittelevissä kirjoissa käsitellään myös logistista regressiota. Kaikissa hänen kirjoissaan, tosin, tämä menetelmä selitetään aivan kummallisesti: hän väittää esimerkiksi, ettei logistinen regressio "tekisi oletuksia" muuttujien välisistä suhteista, tai muuttujien jakaumista. Nämä väitteet eivät pidä paikkaansa, ja niihin pohjautuen hän antaa varsin omituisen neuvon, että logistista regressiota voisi jotenkin käyttää epälineaarisen regression korvikkeena. 
</text>
<link>blathers/NummenmaaKritiikki/logistisesta_regressiosta.html</link>
<image>logitReg.png</image>
</abstract>


<abstract>
<title>Signaalintunnistusteorian alkeita</title>
<language>Suomi</language>
<tags>psychology, tutorial, general audience</tags>
<text>
Tämä on yleistajuinen johdatus signaalintunnistusteorian peruskäsitteisiin, painotus on sen soveltamisessa psykologiaan. Et tarvitse ennakkotietoja tai laajoja matematiikan taitoja.
</text>
<link>blathers/johdatusSDThen/intro_fin.html</link>
<image>sdtFig.png</image>
</abstract>



<abstract>
<title>Omituinen choropeth</title>
<language>Suomi</language>
<tags>general audience, blather</tags>
<text>
Imgur-sivustolla vastaan tuli omituinen kuvaaja koronatilastoista. 

Onko kyseessä tietoinen huijaus, yritys johtaa ihmisiä harhaan vääristelemällä tietoa?

En välttämättä itse hyppäisi sellaiseen johtopäätökseen. Lue enemmän kommentaaristani.
</text>
<link>blathers/omituinenChoropethi/omituinenChoropethi.html</link>
<image>choroFig.png</image>
</abstract>


<abstract>
<title>Hevibändien klusterointi</title>
<language>Suomi</language>
<tags>statistics, critique, general audience</tags>
<text>
Nummenmaan vuoden 2021 kirjassa Tilastotieteen käsikirja tehdään klusterointanalyysia hevibändeistä. Data, johon klusterointi perustuu, ei vain välttämättä ole parasta mahdollista. Motörheadko vähemmän maskuliinista kuin HIM?  Rammstein virtuositeettisempaa kuin Nightwish? 

Tässä kirjoituksessa tuota dataa katsotaan hieman kieli poskessa ja puhutaan hieman juurikin datan laadun merkityksestä.
</text>
<link>blathers/NummenmaaKlusterointi/nummenmaa_klusterointi.html</link>
<image>clustFig.png</image>
</abstract>
`;
