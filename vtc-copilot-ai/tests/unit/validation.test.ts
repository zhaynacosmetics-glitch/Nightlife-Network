import { test } from "node:test";
import assert from "node:assert/strict";
import { isValidEmail, normalizeEmail, validateContact, validateWaitlist } from "../../src/lib/validation.ts";
import { RIDE_MAIN, RIDE_MID, RIDE_TRAP, estimate } from "../../shared/demo.ts";

test("normalise les e-mails", () => {
  assert.equal(normalizeEmail("  Karim.Test@Exemple.FR "), "karim.test@exemple.fr");
});

test("accepte les e-mails courants et refuse les invalides", () => {
  for (const ok of ["a.b@exemple.fr", "prenom+vtc@gmail.com", "x@sous.domaine.co.uk"]) assert.ok(isValidEmail(ok), ok);
  for (const ko of ["", "nope", "a@b", "a@b.c", "a..b@exemple.fr", ".a@exemple.fr", "a@-exemple.fr", "a b@exemple.fr", `${"a".repeat(65)}@exemple.fr`]) assert.ok(!isValidEmail(ko), ko);
});

test("valide une inscription correcte", () => {
  const { data, errors } = validateWaitlist({ firstName: "  Anne-Sophie ", email: "AS@Exemple.fr", zone: "93", consentMarketing: true });
  assert.deepEqual(errors, {});
  assert.deepEqual(data, { firstName: "Anne-Sophie", email: "as@exemple.fr", zone: "93", consentMarketing: true, consentResearch: false });
});

test("refuse sans consentement, avec zone inconnue ou prénom suspect", () => {
  const { data, errors } = validateWaitlist({ firstName: "R2D2", email: "x@exemple.fr", zone: "99" });
  assert.equal(data, undefined);
  assert.ok(errors.firstName && errors.zone && errors.consentMarketing);
});

test("valide le formulaire de contact", () => {
  assert.ok(validateContact({ name: "Claire", email: "c@entreprise.fr", message: "Bonjour, échangeons." }).data);
  assert.ok(validateContact({ name: "Claire", email: "c@entreprise.fr", message: "court" }).errors.message);
});

test("le modèle de démonstration produit les trois états attendus", () => {
  assert.equal(estimate(RIDE_MAIN).verdict, "green");
  assert.equal(estimate(RIDE_MID).verdict, "orange");
  assert.equal(estimate(RIDE_TRAP).verdict, "red");
  assert.equal(Math.round(estimate(RIDE_TRAP).hourly), 6);
});

test("retire les chevrons et caractères de contrôle des prénoms", () => {
  const { data } = validateWaitlist({ firstName: "<Léa>\u0000", email: "lea@exemple.fr", consentMarketing: true });
  assert.equal(data?.firstName, "Léa");
});
