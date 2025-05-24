---
title: "Kotlin 语言特性和提案"
description: "了解 Kotlin 特性的生命周期。此页面包含 Kotlin 语言特性和设计提案的完整列表。"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

JetBrains 遵循 [Kotlin 语言演进原则](kotlin-evolution-principles)，以务实的设计为指导，不断发展 Kotlin 语言。

:::note
语言特性提案从 Kotlin 1.7.0 开始列出。

有关语言特性状态的说明，请参阅 [Kotlin 演进原则文档](kotlin-evolution-principles#pre-stable-features)。

:::

<Tabs>
<TabItem value="all-proposals" label="All">

<!-- <include element-id="all-proposals" from="all-proposals.topic"/> -->

{/* START_SNIPPET: source */}
<table >

<!-- EXPLORATION AND DESIGN BLOCK -->
<tr filter="exploration-and-design">
<td width="200">

**探索与设计 (Exploration and design)**
</td>
<td>

**Kotlin 静态成员和静态扩展 (Kotlin statics and static extensions)**

* KEEP 提案：[statics.md](https://github.com/Kotlin/KEEP/blob/statics/proposals/statics)
* YouTrack 问题：[KT-11968](https://youtrack.jetbrains.com/issue/KT-11968)
</td>
</tr>
<tr filter="exploration-and-design">
<td>

**探索与设计 (Exploration and design)**
</td>
<td>

**集合字面量 (Collection literals)**

* KEEP 提案：未定义
* YouTrack 问题：[KT-43871](https://youtrack.jetbrains.com/issue/KT-43871)
</td>
</tr>
<tr filter="exploration-and-design">
<td>

**探索与设计 (Exploration and design)**
</td>
<td>

**用于错误和异常的联合类型 (Union types for errors and exceptions)**

* KEEP 提案：未定义
* YouTrack 问题：[KT-68296](https://youtrack.jetbrains.com/issue/KT-68296)
</td>
</tr>
<tr filter="exploration-and-design">
<td>

**探索与设计 (Exploration and design)**
</td>
<td>

**基于名称的解构 (Name-based destructuring)**

* KEEP 提案：未定义
* YouTrack 问题：[KT-19627](https://youtrack.jetbrains.com/issue/KT-19627)
</td>
</tr>
<tr filter="exploration-and-design">
<td>

**探索与设计 (Exploration and design)**
</td>
<td>

**支持不变性 (Support immutability)**

* KEEP 备注：[immutability](https://github.com/Kotlin/KEEP/blob/master/notes/value-classes#immutability-and-value-classes)
* YouTrack 问题：[KT-1179](https://youtrack.jetbrains.com/issue/KT-1179)
</td>
</tr>

<!-- END OF EXPLORATION AND DESIGN BLOCK -->

<!-- KEEP DISCUSSION BLOCK -->
<tr filter="keep">
<td width="200">

**KEEP 讨论 (KEEP discussion)**
</td>
<td>

**KMP Kotlin 到 Java 的直接实现 (KMP Kotlin-to-Java direct actualization)**

* KEEP 提案：[kmp-kotlin-to-java-direct-actualization.md](https://github.com/Kotlin/KEEP/blob/kotlin-to-java-direct-actualization/proposals/kmp-kotlin-to-java-direct-actualization)
* YouTrack 问题：[KT-67202](https://youtrack.jetbrains.com/issue/KT-67202)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP 讨论 (KEEP discussion)**
</td>
<td>

**kotlin.time.Instant**

* KEEP 提案：[Instant and Clock](https://github.com/dkhalanskyjb/KEEP/blob/dkhalanskyjb-instant/proposals/stdlib/instant)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP 讨论 (KEEP discussion)**
</td>
<td>

**Common Atomics 和 Atomic Arrays**

* KEEP 提案：[Common atomics](https://github.com/Kotlin/KEEP/blob/mvicsokolova/common-atomics/proposals/common-atomics)
* YouTrack 问题：[KT-62423](https://youtrack.jetbrains.com/issue/KT-62423)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP 讨论 (KEEP discussion)**
</td>
<td>

**改进属性上的注解使用位置目标 (Improvements to annotation use-site targets on properties)**

* KEEP 提案：[Improvements to annotation use-site targets on properties](https://github.com/Kotlin/KEEP/blob/change-defaulting-rule/proposals/change-defaulting-rule)
* YouTrack 问题：[KT-19289](https://youtrack.jetbrains.com/issue/KT-19289)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP 讨论 (KEEP discussion)**
</td>
<td>

**嵌套的（非捕获）类型别名 (Nested (non-capturing) type aliases)**

* KEEP 提案：[Nested (non-capturing) type aliases](https://github.com/Kotlin/KEEP/blob/nested-typealias/proposals/nested-typealias)
* YouTrack 问题：[KT-45285](https://youtrack.jetbrains.com/issue/KT-45285)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP 讨论 (KEEP discussion)**
</td>
<td>

**简化 KDoc 歧义链接 (Streamline KDoc ambiguity links)**

* KEEP 提案：[streamline-KDoc-ambiguity-references.md](https://github.com/Kotlin/KEEP/blob/kdoc/Streamline-KDoc-ambiguity-references/proposals/kdoc/streamline-KDoc-ambiguity-references)
* GitHub 问题：[dokka/#3451](https://github.com/Kotlin/dokka/issues/3451), [dokka/#3179](https://github.com/Kotlin/dokka/issues/3179), [dokka/#3334](https://github.com/Kotlin/dokka/issues/3334)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP 讨论 (KEEP discussion)**
</td>
<td>

**解析 KDoc 中扩展的链接 (Resolution of links to extensions in KDoc)**

* KEEP 提案：[links-to-extensions.md](https://github.com/Kotlin/KEEP/blob/kdoc/extension-links/proposals/kdoc/links-to-extensions)
* GitHub 问题：[dokka/#3555](https://github.com/Kotlin/dokka/issues/3555)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP 讨论 (KEEP discussion)**
</td>
<td>

**Uuid**

* KEEP 提案：[uuid.md](https://github.com/Kotlin/KEEP/blob/uuid/proposals/stdlib/uuid)
* YouTrack 问题：[KT-31880](https://youtrack.jetbrains.com/issue/KT-31880)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP 讨论 (KEEP discussion)**
</td>
<td>

**使用预期类型改进解析 (Improve resolution using expected type)**

* KEEP 提案：[improved-resolution-expected-type.md](https://github.com/Kotlin/KEEP/blob/improved-resolution-expected-type/proposals/improved-resolution-expected-type)
* YouTrack 问题：[KT-16768](https://youtrack.jetbrains.com/issue/KT-16768)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP 讨论 (KEEP discussion)**
</td>
<td>

**在 JVM 中公开装箱的内联值类 (Expose boxed inline value classes in JVM)**

* KEEP 提案：[jvm-expose-boxed.md](https://github.com/Kotlin/KEEP/blob/jvm-expose-boxed/proposals/jvm-expose-boxed)
* YouTrack 问题：[KT-28135](https://youtrack.jetbrains.com/issue/KT-28135)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP 讨论 (KEEP discussion)**
</td>
<td>

**显式 backing fields：同一属性的 `public` 和 `private` 类型 (Explicit backing fields: both `public` and `private` type for the same property)**

* KEEP 提案：[explicit-backing-fields.md](https://github.com/Kotlin/KEEP/blob/explicit-backing-fields-re/proposals/explicit-backing-fields)
* YouTrack 问题：[KT-14663](https://youtrack.jetbrains.com/issue/KT-14663)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP 讨论 (KEEP discussion)**
</td>
<td>

**上下文参数：支持上下文相关的声明 (Context parameters: support for context-dependent declarations)**

* KEEP 提案：[context-parameters.md](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters)
* YouTrack 问题：[KT-14663](https://youtrack.jetbrains.com/issue/KT-10468)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP 讨论 (KEEP discussion)**
</td>
<td>

**Java 合成属性引用 (Java synthetic property references)**

* KEEP 提案：[references-to-java-synthetic-properties.md](https://github.com/Kotlin/KEEP/blob/master/proposals/references-to-java-synthetic-properties)
* YouTrack 问题：[KT-8575](https://youtrack.jetbrains.com/issue/KT-8575)
* 目标版本 (Target version): 2.2.0
</td>
</tr>

<!-- END OF KEEP DISCUSSION BLOCK -->

<!-- IN PREVIEW BLOCK -->
<tr filter="in-preview">
<td width="200">

**预览中 (In preview)**
</td>
<td>

**when-with-subject 中的守卫条件 (Guard conditions in when-with-subject)**

* KEEP 提案：[guards.md](https://github.com/Kotlin/KEEP/blob/guards/proposals/guards)
* YouTrack 问题：[KT-13626](https://youtrack.jetbrains.com/issue/KT-13626)
* 可用版本 (Available since): 2.1.0
</td>
</tr>

<!-- the first td element should have the width="200" attribute -->
<tr filter="stable">
<td>

**稳定 (Stable)**
</td>
<td>

**稳定 `@SubclassOptInRequired`**

* KEEP 提案：[subclass-opt-in-required.md](https://github.com/Kotlin/KEEP/blob/master/proposals/subclass-opt-in-required)
* YouTrack 问题：[KT-54617](https://youtrack.jetbrains.com/issue/KT-54617)
* 可用版本 (Available since): 2.1.0
</td>
</tr>
<tr filter="in-preview">
<td>

**预览中 (In preview)**
</td>
<td>

**Multidollar interpolation：改进了字符串字面量中 `$` 的处理 (Multidollar interpolation: improved handling of `$` in string literals)**

* KEEP 提案：[dollar-escape.md](https://github.com/Kotlin/KEEP/blob/master/proposals/dollar-escape)
* YouTrack 问题：[KT-2425](https://youtrack.jetbrains.com/issue/KT-2425)
* 可用版本 (Available since): 2.1.0
</td>
</tr>
<tr filter="in-preview">
<td>

**预览中 (In preview)**
</td>
<td>

**非本地 `break` 和 `continue` (Non-local `break` and `continue`)**

* KEEP 提案：[break-continue-in-inline-lambdas.md](https://github.com/Kotlin/KEEP/blob/master/proposals/break-continue-in-inline-lambdas)
* YouTrack 问题：[KT-1436](https://youtrack.jetbrains.com/issue/KT-1436)
* 可用版本 (Available since): 2.1.0
</td>
</tr>

<!-- END OF IN PREVIEW BLOCK -->

<!-- STABLE BLOCK -->
<tr filter="stable">
<td width="200">

**稳定 (Stable)**
</td>
<td>

**`Enum.entries`：`Enum.values()` 的高性能替代品 ( `Enum.entries`: performant replacement of the `Enum.values()`)**

* KEEP 提案：[enum-entries.md](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries)
* YouTrack 问题：[KT-48872](https://youtrack.jetbrains.com/issue/KT-48872)
* 目标版本 (Target version): 2.0.0
</td>
</tr>
<tr filter="stable">
<td>

**稳定 (Stable)**
</td>
<td>

**Data objects**

* KEEP 提案：[data-objects.md](https://github.com/Kotlin/KEEP/blob/master/proposals/data-objects)
* YouTrack 问题：[KT-4107](https://youtrack.jetbrains.com/issue/KT-4107)
* 目标版本 (Target version): 1.9.0
</td>
</tr>
<tr filter="stable">
<td>

**稳定 (Stable)**
</td>
<td>

**RangeUntil 运算符 `..<` (RangeUntil operator `..<`)**

* KEEP 提案：[open-ended-ranges.md](https://github.com/kotlin/KEEP/blob/open-ended-ranges/proposals/open-ended-ranges)
* YouTrack 问题：[KT-15613](https://youtrack.jetbrains.com/issue/KT-15613)
* 目标版本 (Target version): 1.7.20
</td>
</tr>
<tr filter="stable">
<td>

**稳定 (Stable)**
</td>
<td>

**Definitely non-nullable types**

* KEEP 提案：[definitely-non-nullable-types.md](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types)
* YouTrack 问题：[KT-26245](https://youtrack.jetbrains.com/issue/KT-26245)
* 目标版本 (Target version): 1.7.0
</td>
</tr>

<!-- END OF STABLE BLOCK -->

<!-- REVOKED BLOCK -->
<tr filter="revoked">
<td width="200">

**已撤销 (Revoked)**
</td>
<td>

**上下文接收者 (Context receivers)**

* KEEP 提案：[context-receivers.md](https://github.com/Kotlin/KEEP/blob/master/proposals/context-receivers)
* YouTrack 问题：[KT-10468](https://youtrack.jetbrains.com/issue/KT-10468)
</td>
</tr>
</table>

{/* END_SNIPPET: source */}

<!-- END OF REVOKED BLOCK -->

</TabItem>

<TabItem value="exploration-and-design" label="Exploration and design">

{/* Note: This is an included content from kotlin-language-features-and-proposals.md, element source, with filters: empty,exploration-and-design */}

</TabItem>

<TabItem value="keep-preparation" label="KEEP discussion">

{/* Note: This is an included content from kotlin-language-features-and-proposals.md, element source, with filters: empty,keep */}

</TabItem>

<TabItem value="in-preview" label="In preview">

{/* Note: This is an included content from kotlin-language-features-and-proposals.md, element source, with filters: empty,in-preview */}

</TabItem>

<TabItem value="stable" label="Stable">

{/* Note: This is an included content from kotlin-language-features-and-proposals.md, element source, with filters: empty,stable */}

</TabItem>

<TabItem value="revoked" label="Revoked">

{/* Note: This is an included content from kotlin-language-features-and-proposals.md, element source, with filters: empty,revoked */}

</TabItem>
</Tabs>