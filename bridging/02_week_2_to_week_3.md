Last week began outside the model. We examined the validity of benchmark scores, asking: do they truly back their claims? Models can answer multiple-choice questions correctly because 1) they worked through the problem, or less desirably 2) because they encountered those exact questions during pre-training! Accuracy numbers by themselves cannot separate the two. In response, we built **minimal contrasting pairs**: taking questions the model already answered correctly, changing one aspect of format, and watching what occurs after to diagnose. We saw that permuting the answer options kept every word of the question intact and only moved the correct answer to a different letter choice, but accuracy still slipped. This suggests that models unfortunately sometimes remember a multiple-choice letter rather than a correct answer! Substituting a number was the sharper test, since the correct answer had to be recomputed alongside it. In the notebook, one question had the model reach for the original answer value on all five variants, long after that value had stopped being correct.

Those two experiments exposed two very different model failure modes. Reacting to a change that should not matter is **oversensitivity**, and failing to react to one that should is **overstability**. In the notebooks, both appeared in the same model, on the same benchmark, which is worth remembering whenever a single number or benchmark score is offered as evidence of competence. Notice also how much care went into the perturbations themselves. Each variant held the wording, the structure, and the style of the distractors fixed so that exactly one thing was modified; this is a necessary design choice to isolate a single exact cause of unintended behavior.

The second half of the week went back inside the model. The **logit lens** reuses the model’s own unembedding layer at every layer and every token, reading each intermediate activation as though it were the final one. Applied to a Spanish-to-French translation prompt in the notebook, the middle layers decoded to “love” just before the model produced “amour”, even though English was never part of what was requested in the translation process. **PCA** then gave us a way to look at activations without assuming they were decoding into tokens at all, and a supervised **linear probe** trained on a single layer recovered the language of an input directly from its activation.

Then came the catch and one of the hinges of the whole course! A probe that predicts well has found a direction that separates two groups, which is a different achievement from finding a direction the model actually uses. Prof. X could predict which students would pass from their grades without learning anything useful about how to help them pass, and a probe can do exactly the same to us. **Difference-in-means** gave us a direction that does both jobs at once, and we used it to push the model into answering in French. However, nothing in a probe’s accuracy signals whether its direction is causal; that has to be established some other way.

And so establishing that same causal direction is what this next week is about. We will take the question that has been building since the course opened, which is whether an internal component we have identified is really contributing to the work we credit it with, and turn it into an experiment. Our intention is to intervene: change something inside the model on purpose, then see whether the output changes the way our explanation predicts. **Ablations** remove information from a component and ask whether the behavior survives without it. **Interchange interventions** take an activation from one input and place it into the run of another, so that if a site carries the variable we think it carries, the output should follow the transplanted value rather than the original one. These come with a formal vocabulary, built on causal mediation analysis and causal abstraction, for saying precisely what it means for a network to implement an algorithm. Correlation has carried us a long way, and now we get to test it!

---

**What we learned from last week’s notebooks**

*Behavioral analysis and input attribution*

1. Construct minimal contrasting pairs that assess robustness of the model.
2. Run a model on these pairs and measure the accuracy gap between originals and perturbations.
3. Interpret the results to identify which examples are likely memorized from pre-training data or just happen to get right.

*Probes for decoding activations*

* **Linear probing**: decoding neural activations with linear transformations.
* **Relationship between probing & steering**: how we turn our ability to **predict** into a way to **control** behavior (and why it doesn’t always work!).
* **Difference-in-means steering**: simple but effective method for controlling model behavior through its activations.
