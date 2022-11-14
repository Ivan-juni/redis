import { Router } from "express";
import { personRepository } from "../controllers/personController.js";

export const router = Router();

// create person
router.put("/", async (req, res) => {
  const person = await personRepository.createAndSave(req.body);
  res.send(person);
});

// find person by id
router.get("/:id", async (req, res) => {
  const person = await personRepository.fetch(req.params.id);
  res.send(person);
});

// update person
router.post("/:id", async (req, res) => {
  const person = await personRepository.fetch(req.params.id);

  person.firstName = req.body.firstName ?? null;
  person.lastName = req.body.lastName ?? null;
  person.age = req.body.age ?? null;
  person.verified = req.body.verified ?? null;
  person.location = req.body.location ?? null;
  person.locationUpdated = req.body.locationUpdated ?? null;
  person.skills = req.body.skills ?? null;
  person.personalStatement = req.body.personalStatement ?? null;

  await personRepository.save(person);

  res.send(person);
});

// delete person
router.delete("/:id", async (req, res) => {
  await personRepository.remove(req.params.id);
  res.send({ entityId: req.params.id });
});
