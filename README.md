# CS 221M: Mechanistic Interpretability

Stanford University, Spring 2026

Course website: [https://cs221m.github.io/](https://cs221m.github.io/)

## Syllabus

**Weeks 1-5**: core materials.

**Weeks 6-10**: guest speakers and project presentations.

| Week        | Date          | Lecture                                    | Notebook |
| ----------- | ------------- | ------------------------------------------ | -------- |
| **Week 1**  | Mon. March 30 | Introduction                               | — |
|             | Wed. April 1  | Review of language models                  | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/rkapur102/cs221m-course/blob/main/02_review_of_lms.ipynb) |
| **Week 2**  | Mon. April 6  | Behavioral analysis and input attribution  | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/rkapur102/cs221m-course/blob/main/03_behavioral_analysis.ipynb) |
|             | Wed. April 8  | Probes for decoding activations            | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/rkapur102/cs221m-course/blob/main/04_probes.ipynb) |
| **Week 3**  | Mon. April 13 | Causal methods for interpretability        | — |
|             | Wed. April 15 | Interventions for steering activations     | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/rkapur102/cs221m-course/blob/main/06_interventions.ipynb) |
| **Week 4**  | Mon. April 20 | Theory of causal abstraction               | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/rkapur102/cs221m-course/blob/main/07_causal_abstraction_i.ipynb) |
|             | Wed. April 22 | Causal mediation analysis                  | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/rkapur102/cs221m-course/blob/main/08_causal_mediation_analysis.ipynb) |
| **Week 5**  | Mon. April 27 | Designing counterfactuals                  | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/rkapur102/cs221m-course/blob/main/09_counterfactual_design.ipynb) |
|             | Wed. April 29 | Automated causal interpretability          | (i) [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/rkapur102/cs221m-course/blob/main/10_causal_abstraction_ii.ipynb) (ii) [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/rkapur102/cs221m-course/blob/main/10_automated_causal_interpretability.ipynb) |
| **Week 6**  | Mon. May 4    | Guest lecture — Chris Potts                | — |
|             | Wed. May 6    | Guest lecture — Jack Merullo               | — |
| **Week 7**  | Mon. May 11   | Guest lecture — David Bau                  | — |
|             | Wed. May 13   | Mid-project check-in                       | — |
| **Week 8**  | Mon. May 18   | Guest lecture — Neel Nanda                 | — |
|             | Wed. May 20   | Guest lecture — Jing Huang                 | — |
| **Week 9**  | Mon. May 25   | —                                          | — |
|             | Wed. May 27   | Guest lecture — Jack Lindsey               | — |
| **Week 10** | Mon. June 1   | Guest lecture — Naomi Saphra               | — |
|             | Wed. June 3   | Project presentations                      | — |

## Learning goals

#### 1. Introduction
 - Overview of course 
 - No notebook for this lecture; see the [slides](materials/01_slides.pdf)

#### 2. Review of language models
 - Reviewing fundamentals of language models with an eye towards understaning their components
 - Autoregressive modeling - activations can only be affected by previous tokens
 - Residual stream, attention (moving information between tokens), and MLP (processing/recalling information)

#### 3. Behavioral analysis and input attribution
 - Minimal pairs for understanding model behavior
 - Input attribution - integrated gradients

#### 4. Probes for decoding activations
 - Survey probing methods: logit lens (pre-initialized probe), PCA (unsupervised), and supervised linear probes
 - Introduction to constructing interventions from probes (steering vectors)

#### 5. Causal methods for interpretability
 - No notebook for this lecture; see the [slides](https://cs221m.github.io/materials/05_slides.pdf)

#### 6. Interventions for steering activations
 - Survey different types of interventions an their respective goals
 - Iterative nullspace projection for erasing information
 - Interchange interventions for localizing representations
 - Representation fine-tuning for controlling model behavior

#### 7. Theory of causal abstraction
 - Theory of constructive abstraction
 - Example constructive abstraction in hierarchical equality task

#### 8. Causal mediation analysis
 - Interchange interventions on minimal pairs for tracing information flow
 - Intervening on residual stream, individual attention heads
 - Tracing information flow in factual recall, reference resolution

#### 9. Designing counterfactuals
 - Guidelines for designing counterfactuals to target specific causal variables
 - Pointer-value mechanism in MCQA,
 - Multi-source interventions and entity vs. relation in RAVEL

#### 10. Automated causal interpretability
 - Introduction to distributed alignment search
 - Disentangling entity and relation in RAVEL
 - Theory of abstraction under translation
 - Walkthrough example of DAS on hierarchical equality
