---
title: "Kotlin 컴포넌트 안정성 (1.4 이전)"
---
<no-index/>

컴포넌트의 진화 속도에 따라 여러 가지 안정성 모드가 있을 수 있습니다.

<a name="moving-fast"/>

*   **Moving fast (MF)**: [incremental releases(증분 릴리스)](kotlin-evolution-principles#language-and-tooling-releases) 간에도 호환성이 보장되지 않으며, 경고 없이 모든 기능을 추가, 제거 또는 변경할 수 있습니다.

*   **Additions in Incremental Releases (AIR)**: 증분 릴리스에서 항목을 추가할 수 있으며, 동작의 제거 및 변경은 피해야 하며 필요한 경우 이전 증분 릴리스에서 발표해야 합니다.

*   **Stable Incremental Releases (SIR)**: 증분 릴리스는 완전히 호환되며 최적화 및 버그 수정만 발생합니다. 모든 변경 사항은 [language release(언어 릴리스)](kotlin-evolution-principles#language-and-tooling-releases)에서 수행할 수 있습니다.

<a name="fully-stable"/>

*   **Fully Stable (FS)**: 증분 릴리스는 완전히 호환되며 최적화 및 버그 수정만 발생합니다. 기능 릴리스는 이전 버전과 호환됩니다.

소스 및 바이너리 호환성은 동일한 컴포넌트에 대해 다른 모드를 가질 수 있습니다. 예를 들어 소스 언어가 바이너리 형식이 안정화되기 전에 완전한 안정성에 도달하거나 그 반대의 경우도 가능합니다.

[Kotlin evolution policy(Kotlin 진화 정책)](kotlin-evolution-principles)의 조항은 Full Stability (FS)에 도달한 컴포넌트에만 완전히 적용됩니다. 그때부터 호환되지 않는 변경 사항은 Language Committee의 승인을 받아야 합니다.

|**Component**|**Status Entered at version**|**Mode for Sources**|**Mode for Binaries**|
| --- | --- | --- | --- |
Kotlin/JVM|1.0|FS|FS|
kotlin-stdlib (JVM)|1.0|FS|FS
KDoc syntax|1.0|FS|N/A
Coroutines|1.3|FS|FS
kotlin-reflect (JVM)|1.0|SIR|SIR
Kotlin/JS|1.1|AIR|MF
Kotlin/Native|1.3|AIR|MF
Kotlin Scripts (*.kts)|1.2|AIR|MF
dokka|0.1|MF|N/A
Kotlin Scripting APIs|1.2|MF|MF
Compiler Plugin API|1.0|MF|MF
Serialization|1.3|MF|MF
Multiplatform Projects|1.2|MF|MF
Inline classes|1.3|MF|MF
Unsigned arithmetics|1.3|MF|MF
**All other experimental features, by default**|N/A|**MF**|**MF**