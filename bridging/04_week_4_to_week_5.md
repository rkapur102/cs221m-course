Last week, we used interchange interventions as a systematic method. **Causal mediation analysis** asks how much of a model’s behavior flows through one internal component (the **mediator**). To understand this, we patched that component with its value from a contrasting input and measured how much the output changes. Working with SmolLM2-360M on the “Eiffel Tower is in the country of” and “Tokyo Tower is in the country of” examples from the notebook, we scored each patch by how far it moved the **log odds** of “France” over “Japan”. The logit lens had already shown the country emerging around layers 26 and 27. But as we saw in Lecture 4, being able to decode a value at a layer does not necessarily mean the model *uses* it there, so we needed to patch every layer at every token position to find out.

The result was a map of where our relevant information resided within the model and how it traveled. More specifically, the landmark’s information stayed at “Eiffel” in the early layers, then moved to the final token around layer 26. In this sort of analysis, we can also choose a finer **mediator**. Each attention layer is made of several heads that pull information from other tokens, and swapping in one head’s output at a time showed that a single head carried the landmark’s information to the final token. Finally, interventions can be combined. Patching from the Tokyo prompt and from “Eiffel Tower is in the city of” at once made the model answer “Tokyo”, which neither source prompt answers on its own (they answer “Japan” and “Paris”), so the patches must have carried abstract variables: *which landmark*, and *which attribute*.

Mediation tells us *where* information travels, and Lecture 8 asked what *role* it plays. **Causal abstraction** treats a step-by-step algorithm and a neural network the same way, as **causal models**: sets of variables, each computed from the ones before it. The question is whether the algorithm’s variables correspond to something inside the network. Our example algorithm read four letters and decided whether its two pairs follow the same pattern (the **hierarchical equality task**: AABB and ABCD do, ABCC does not), first checking each pair and then comparing the two answers.

To test that correspondence, an **alignment** pairs each algorithm variable with a set of the network’s neurons. Interchange interventions then check it: if the alignment is right, overwriting those neurons with their values from another input should change the network’s answer exactly as the algorithm predicts. **Interchange intervention accuracy (IIA)** is the fraction of input pairs on which this holds. The correct alignment scored a perfect 1.0, while moving a single neuron into the wrong group dropped it to about 0.85, so IIA is sensitive to the network’s actual structure!

This week closes out the core material of the course. Since an IIA score is only as informative as the input pairs behind it, Lecture 9 on **counterfactual design** asks how to choose pairs that truly test a variable: ones that change it, change the output the algorithm predicts, and cannot be explained equally well by a competing variable. Lecture 10 then drops the assumption that each variable lives in its own set of neurons. Neurons in language models are often **polysemantic** (each responds to several unrelated concepts), so **distributed alignment search (DAS)** looks for variables along learned directions in activation space, and we will test whether an intervention can change one attribute of an entity, like the country of Paris, while leaving the others intact. From week 6 onward, the course turns to guest lectures and final projects, where you will bring these methods to questions of your own!

---

**What we learned from last week’s notebooks**

*Causal mediation analysis*

* **Causal mediation analysis**: intervening on each model component to measure its causal effect on model output.
* **Tracing information flow**: how to read and interpret plots that trace the flow of information in the model when processing a specific input.
* **Entity binding**: an initial glimpse into how models track state and compute relations between two entities in context.
* **Composition of interventions**: how applying interventions from multiple sources can help us identify more fine-grained concepts in the model’s activations.

*Theory of causal abstraction*

* **Algorithms as causal models**: understand algorithms as causal models with variables, values, and mechanisms.
* **Neural networks as causal models**: understand neural networks as causal models with variables, values, and mechanisms.
* **Interchange interventions**: interventions that simulate the value a variable would have taken if a different input were provided.
* **Causal abstraction as implementation**: understand implementation as causal abstraction, where an algorithm is implemented when it abstracts the underlying system.
