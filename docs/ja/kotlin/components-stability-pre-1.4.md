[//]: # (title: Kotlinコンポーネントの安定性（1.4以前）)

<no-index/>

コンポーネントの進化の速さに応じて、異なる安定性モードが存在します。

<a name="moving-fast"/>

*   **高速進化 (MF)**: [インクリメンタルリリース](kotlin-evolution-principles.md#language-and-tooling-releases)間でも互換性は期待できず、機能は警告なしに追加、削除、または変更される可能性があります。

*   **インクリメンタルリリースでの追加 (AIR)**: インクリメンタルリリースでは機能が追加される可能性がありますが、削除や挙動の変更は避けるべきであり、必要な場合は以前のインクリメンタルリリースで告知されるべきです。

*   **安定したインクリメンタルリリース (SIR)**: インクリメンタルリリースは完全に互換性があり、最適化とバグ修正のみが行われます。[言語リリース](kotlin-evolution-principles.md#language-and-tooling-releases)ではあらゆる変更が行われる可能性があります。

<a name="fully-stable"/>

*   **完全安定 (FS)**: インクリメンタルリリースは完全に互換性があり、最適化とバグ修正のみが行われます。機能リリースは後方互換性があります。

ソースとバイナリの互換性は、同じコンポーネントであっても異なるモードを持つことがあります。例えば、ソース言語がバイナリ形式が安定する前に完全な安定性に達したり、その逆の場合もあります。

[Kotlin進化ポリシー](kotlin-evolution-principles.md)の規定は、完全安定 (FS) に達したコンポーネントにのみ完全に適用されます。その時点以降の非互換な変更は、言語委員会によって承認される必要があります。

|**コンポーネント**|**適用バージョン**|**ソースのモード**|**バイナリのモード**|
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
**その他の全ての実験的機能 (デフォルト)**|N/A|**MF**|**MF**