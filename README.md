# HIV-TRACE

HIV-TRACE identifies potential transmission clusters within a supplied FASTA file using pairwise [TN93](https://github.com/veg/tn93) genetic distances.

## Installation

### Prerequisites

- Python >= 3.10
- [tn93](https://github.com/veg/tn93) >= 1.0.6
- [cawlign](https://github.com/veg/cawlign) >= 1.0.3 (unless using `--skip-alignment`)

### pip

```bash
pip install hivtrace
```

## Quick Start

```bash
hivtrace -i INPUT.FASTA -a resolve -r HXB2_prrt -t .015 -m 500 -g .05 -c
```

## Options

### `-i, --input` (required)

FASTA file with nucleotide sequences. Sequence names may include munged attributes, e.g. `ISOLATE_XYZ|2005|SAN DIEGO|MSM`.

### `-a, --ambiguities` (required)

Strategy for handling ambiguous nucleotides. See the [MBE paper](http://mbe.oxfordjournals.org/content/22/5/1208.short) for details.

| Option    | Description                                                     |
|-----------|-----------------------------------------------------------------|
| `resolve` | Count any resolutions that match as a perfect match             |
| `average` | Average all possible resolutions                                |
| `skip`    | Skip all positions with ambiguities                             |
| `gapmm`   | Count character-gap positions as 4-way mismatches, else average |

### `-r, --reference` (required)

Reference sequence for alignment. Built-in options:

| Option         | Region                          |
|----------------|---------------------------------|
| `HXB2_prrt`   | Protease + RT                   |
| `NL4-3_prrt`  | Protease + RT (NL4-3)           |
| `HXB2_pol`    | Protease + RT + Integrase       |
| `HXB2_pr`     | Protease                        |
| `HXB2_rt`     | Reverse Transcriptase           |
| `HXB2_int`    | Integrase                       |
| `HXB2_gag`    | Gag                             |
| `HXB2_env`    | Envelope                        |
| `HXB2_nef`    | Nef                             |
| `HXB2_vif`    | Vif                             |
| `HXB2_vpr`    | Vpr                             |
| `HXB2_vpu`    | Vpu                             |
| `HXB2_tat`    | Tat                             |
| `HXB2_rev`    | Rev                             |

Or provide a path to a custom reference FASTA file. See [HIV-1 genome landmarks](http://www.hiv.lanl.gov/content/sequence/HIV/MAP/landmark.html) for reference.

### `-t, --threshold` (required)

Maximum pairwise TN93 distance for two sequences to be connected by an edge.

### `-m, --minoverlap` (required)

Minimum number of overlapping non-gap characters required for distance calculation. Aim for at least `2 / threshold` aligned characters.

### `-g, --fraction` (required)

Maximum ambiguity fraction (0–1) for the `resolve` strategy. Sequences exceeding this fraction fall back to `average`.

### `-u, --curate`

Screen for contaminants.

| Option       | Description                                            |
|--------------|--------------------------------------------------------|
| `remove`     | Remove spurious edges from the network                 |
| `report`     | Flag sequences sharing a cluster with the reference    |
| `separately` | Flag sequences via secondary tn93 run                  |
| `none`       | Do nothing                                             |

### `-f, --filter`

Phylogenetic test of conditional independence to remove spurious transitive connections (A→B→C appearing as triangles).

| Option   | Description                          |
|----------|--------------------------------------|
| `remove` | Remove spurious transitive edges     |
| `report` | Report spurious transitive edges     |

### `-s, --strip_drams`

Mask drug resistance-associated mutation (DRAM) codon sites.

| Option    | Description                                                                                                          |
|-----------|----------------------------------------------------------------------------------------------------------------------|
| `lewis`   | Sites from [Lewis et al](http://journals.plos.org/plosmedicine/article?id=10.1371/journal.pmed.0050050)              |
| `wheeler` | Sites from [Wheeler et al](http://www.ncbi.nlm.nih.gov/pubmed/20395786)                                             |

### `-c, --compare`

Compare sequences to public sequences from the [Los Alamos HIV Sequence Database](http://hiv.lanl.gov).

### `--skip-alignment`

Use input sequences as-is (assumes pre-aligned). Incompatible with `--compare`.

### `--cawlign`

Path to [cawlign](https://github.com/veg/cawlign) executable (default: `cawlign` in PATH).

### `--score-matrix`

Score matrix for alignment (default: `HIV_BETWEEN_F`).

### `-o, --output`

Output filename. Defaults to `<input>.results.json`.

## Viewing Results

```bash
hivtrace_viz results.json
```

Or visit [hivtrace-viz](https://veg.github.io/hivtrace-viz/) and click **Load File**.

### Cloudflare Pages (Web Viewer)

A static web viewer is also deployed on Cloudflare Pages:

1. Open the deployed URL in your browser
2. Drop a `.json` results file onto the page, click **Load File**, or use **Load from URL**
3. Alternatively, append `?url=results.json` to load a file hosted at the same domain

#### Deploying Your Own Instance

To deploy the web viewer to Cloudflare Pages:

1. Fork or clone this repository
2. In the Cloudflare Dashboard, go to **Workers & Pages** → **Create** → **Pages**
3. Connect your Git repository
4. Configure the build settings:
   - **Build command**: `npm install && npm run build`
   - **Build output directory**: `hivtrace/web/static`
5. Deploy

The static site is fully client-side — all computation happens in the browser after loading a results JSON file.
