[//]: # (title: Kotlin 컴포넌트의 안정성 (1.4 이전))

<no-index/>

컴포넌트의 진화 속도에 따라 다양한 안정성 모드가 있을 수 있습니다:

<a name="moving-fast"/>

*   **빠르게 변화 (MF)**: [증분 릴리스](kotlin-evolution-principles.md#language-and-tooling-releases) 간에도 호환성을 기대할 수 없으며, 어떠한 기능도 경고 없이 추가, 제거 또는 변경될 수 있습니다.

*   **증분 릴리스에서 추가 (AIR)**: 증분 릴리스에서 기능이 추가될 수 있으며, 제거 및 동작 변경은 피해야 하며, 필요한 경우 이전 증분 릴리스에서 공지되어야 합니다.

*   **안정적인 증분 릴리스 (SIR)**: 증분 릴리스는 완전히 호환되며, 최적화 및 버그 수정만 이루어집니다. 어떤 변경 사항이라도 [언어 릴리스](kotlin-evolution-principles.md#language-and-tooling-releases)에서 이루어질 수 있습니다.

<a name="fully-stable"/>

*   **완전 안정 (FS)**: 증분 릴리스는 완전히 호환되며, 최적화 및 버그 수정만 이루어집니다. 피처 릴리스는 하위 호환성을 유지합니다.

소스 및 바이너리 호환성은 동일한 컴포넌트라도 다른 모드를 가질 수 있습니다. 예를 들어, 소스 언어는 바이너리 형식이 안정화되기 전에 완전한 안정성을 달성할 수 있으며, 그 반대도 가능합니다.

[Kotlin 진화 정책](kotlin-evolution-principles.md)의 조항은 완전 안정(FS)에 도달한 컴포넌트에만 완전히 적용됩니다. 그 시점부터 호환되지 않는 변경 사항은 언어 위원회의 승인을 받아야 합니다.

|**컴포넌트**|**버전 진입 시점**|**소스 모드**|**바이너리 모드**|
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
**기본적으로 모든 기타 실험적 기능**|N/A|**MF**|**MF**