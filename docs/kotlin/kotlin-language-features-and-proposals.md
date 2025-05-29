[//]: # (title: Kotlin 语言特性与提案)
[//]: # (description: 了解 Kotlin 语言特性的生命周期。此页面包含 Kotlin 语言特性和设计提案的完整列表。)

JetBrains 根据[Kotlin 语言演进原则](kotlin-evolution-principles.md)发展 Kotlin 语言，并以实用设计为指导。

> 语言特性提案从 Kotlin 1.7.0 开始列出。
>
> 请参阅[Kotlin 演进原则文档](kotlin-evolution-principles.md#pre-stable-features)中关于语言特性状态的解释。
>
{style="note"}

<tabs>
<tab id="all-proposals" title="全部">

<!-- <include element-id="all-proposals" from="all-proposals.topic"/> -->

<snippet id="source">
<table style="header-column">

<!-- EXPLORATION AND DESIGN BLOCK -->

<tr filter="exploration-and-design">
<td width="200">

**探索与设计**

</td>
<td>

**Kotlin 静态成员与静态扩展**

* KEEP 提案：[statics.md](https://github.com/Kotlin/KEEP/blob/statics/proposals/statics.md)
* YouTrack 问题：[KT-11968](https://youtrack.jetbrains.com/issue/KT-11968)

</td>
</tr>

<tr filter="exploration-and-design">
<td>

**探索与设计**

</td>
<td>

**集合字面量**

* KEEP 提案：未定义
* YouTrack 问题：[KT-43871](https://youtrack.jetbrains.com/issue/KT-43871)

</td>
</tr>

<tr filter="exploration-and-design">
<td>

**探索与设计**

</td>
<td>

**错误与异常的联合类型**

* KEEP 提案：未定义
* YouTrack 问题：[KT-68296](https://youtrack.jetbrains.com/issue/KT-68296)

</td>
</tr>

<tr filter="exploration-and-design">
<td>

**探索与设计**

</td>
<td>

**基于名称的解构**

* KEEP 提案：未定义
* YouTrack 问题：[KT-19627](https://youtrack.jetbrains.com/issue/KT-19627)

</td>
</tr>

<tr filter="exploration-and-design">
<td>

**探索与设计**

</td>
<td>

**支持不变性**

* KEEP 备注：[immutability](https://github.com/Kotlin/KEEP/blob/master/notes/value-classes.md#immutability-and-value-classes)
* YouTrack 问题：[KT-1179](https://youtrack.jetbrains.com/issue/KT-1179)

</td>
</tr>

<!-- END OF EXPLORATION AND DESIGN BLOCK -->

<!-- KEEP DISCUSSION BLOCK -->

<tr filter="keep">
<td width="200">

**KEEP 讨论**

</td>
<td>

**KMP Kotlin 到 Java 直接实际化**

* KEEP 提案：[kmp-kotlin-to-java-direct-actualization.md](https://github.com/Kotlin/KEEP/blob/kotlin-to-java-direct-actualization/proposals/kmp-kotlin-to-java-direct-actualization.md)
* YouTrack 问题：[KT-67202](https://youtrack.jetbrains.com/issue/KT-67202)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 讨论**

</td>
<td>

**kotlin.time.Instant**

* KEEP 提案：[Instant and Clock](https://github.com/dkhalanskyjb/KEEP/blob/dkhalanskyjb-instant/proposals/stdlib/instant.md)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 讨论**

</td>
<td>

**通用原子操作与原子数组**

* KEEP 提案：[Common atomics](https://github.com/Kotlin/KEEP/blob/mvicsokolova/common-atomics/proposals/common-atomics.md)
* YouTrack 问题：[KT-62423](https://youtrack.jetbrains.com/issue/KT-62423)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 讨论**

</td>
<td>

**改进属性上的注解使用点目标**

* KEEP 提案：[Improvements to annotation use-site targets on properties](https://github.com/Kotlin/KEEP/blob/change-defaulting-rule/proposals/change-defaulting-rule.md)
* YouTrack 问题：[KT-19289](https://youtrack.jetbrains.com/issue/KT-19289)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 讨论**

</td>
<td>

**嵌套（非捕获）类型别名**

* KEEP 提案：[Nested (non-capturing) type aliases](https://github.com/Kotlin/KEEP/blob/nested-typealias/proposals/nested-typealias.md)
* YouTrack 问题：[KT-45285](https://youtrack.jetbrains.com/issue/KT-45285)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 讨论**

</td>
<td>

**简化 KDoc 歧义链接**

* KEEP 提案：[streamline-KDoc-ambiguity-references.md](https://github.com/Kotlin/KEEP/blob/kdoc/Streamline-KDoc-ambiguity-references/proposals/kdoc/streamline-KDoc-ambiguity-references.md)
* GitHub 问题：[dokka/#3451](https://github.com/Kotlin/dokka/issues/3451), [dokka/#3179](https://github.com/Kotlin/dokka/issues/3179), [dokka/#3334](https://github.com/Kotlin/dokka/issues/3334)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 讨论**

</td>
<td>

**KDoc 中扩展链接的解析**

* KEEP 提案：[links-to-extensions.md](https://github.com/Kotlin/KEEP/blob/kdoc/extension-links/proposals/kdoc/links-to-extensions.md)
* GitHub 问题：[dokka/#3555](https://github.com/Kotlin/dokka/issues/3555)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 讨论**

</td>
<td>

**Uuid**

* KEEP 提案：[uuid.md](https://github.com/Kotlin/KEEP/blob/uuid/proposals/stdlib/uuid.md)
* YouTrack 问题：[KT-31880](https://youtrack.jetbrains.com/issue/KT-31880)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 讨论**

</td>
<td>

**改进使用预期类型的解析**

* KEEP 提案：[improved-resolution-expected-type.md](https://github.com/Kotlin/KEEP/blob/improved-resolution-expected-type/proposals/improved-resolution-expected-type.md)
* YouTrack 问题：[KT-16768](https://youtrack.jetbrains.com/issue/KT-16768)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 讨论**

</td>
<td>

**在 JVM 中暴露装箱的内联值类**

* KEEP 提案：[jvm-expose-boxed.md](https://github.com/Kotlin/KEEP/blob/jvm-expose-boxed/proposals/jvm-expose-boxed.md)
* YouTrack 问题：[KT-28135](https://youtrack.jetbrains.com/issue/KT-28135)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 讨论**

</td>
<td>

**显式支持字段：同一属性的公共和私有类型**

* KEEP 提案：[explicit-backing-fields.md](https://github.com/Kotlin/KEEP/blob/explicit-backing-fields-re/proposals/explicit-backing-fields.md)
* YouTrack 问题：[KT-14663](https://youtrack.jetbrains.com/issue/KT-14663)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 讨论**

</td>
<td>

**上下文参数：支持上下文相关的声明**

* KEEP 提案：[context-parameters.md](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md)
* YouTrack 问题：[KT-14663](https://youtrack.jetbrains.com/issue/KT-10468)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 讨论**

</td>
<td>

**Java 合成属性引用**

* KEEP 提案：[references-to-java-synthetic-properties.md](https://github.com/Kotlin/KEEP/blob/master/proposals/references-to-java-synthetic-properties.md)
* YouTrack 问题：[KT-8575](https://youtrack.jetbrains.com/issue/KT-8575)
* 目标版本：2.2.0

</td>
</tr>

<!-- END OF KEEP DISCUSSION BLOCK -->

<!-- IN PREVIEW BLOCK -->

<tr filter="in-preview">
<td width="200">

**预览中**

</td>
<td>

**when-with-subject 中的守卫条件**

* KEEP 提案：[guards.md](https://github.com/Kotlin/KEEP/blob/guards/proposals/guards.md)
* YouTrack 问题：[KT-13626](https://youtrack.jetbrains.com/issue/KT-13626)
* 可用版本：2.1.0

</td>
</tr>

<!-- the first td element should have the width="200" attribute -->

<tr filter="stable">
<td>

**稳定版**

</td>
<td>

**稳定化的 `@SubclassOptInRequired`**

* KEEP 提案：[subclass-opt-in-required.md](https://github.com/Kotlin/KEEP/blob/master/proposals/subclass-opt-in-required.md)
* YouTrack 问题：[KT-54617](https://youtrack.jetbrains.com/issue/KT-54617)
* 可用版本：2.1.0

</td>
</tr>

<tr filter="in-preview">
<td>

**预览中**

</td>
<td>

**多美元符号插值：改进字符串字面量中 `$` 的处理**

* KEEP 提案：[dollar-escape.md](https://github.com/Kotlin/KEEP/blob/master/proposals/dollar-escape.md)
* YouTrack 问题：[KT-2425](https://youtrack.jetbrains.com/issue/KT-2425)
* 可用版本：2.1.0

</td>
</tr>

<tr filter="in-preview">
<td>

**预览中**

</td>
<td>

**非局部 `break` 和 `continue`**

* KEEP 提案：[break-continue-in-inline-lambdas.md](https://github.com/Kotlin/KEEP/blob/master/proposals/break-continue-in-inline-lambdas.md)
* YouTrack 问题：[KT-1436](https://youtrack.jetbrains.com/issue/KT-1436)
* 可用版本：2.1.0

</td>
</tr>

<!-- END OF IN PREVIEW BLOCK -->

<!-- STABLE BLOCK -->

<tr filter="stable">
<td width="200">

**稳定版**

</td>
<td>

``Enum.entries`：`Enum.values()` 的高性能替代`

* KEEP 提案：[enum-entries.md](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md)
* YouTrack 问题：[KT-48872](https://youtrack.jetbrains.com/issue/KT-48872)
* 目标版本：2.0.0

</td>
</tr>

<tr filter="stable">
<td>

**稳定版**

</td>
<td>

**数据对象**

* KEEP 提案：[data-objects.md](https://github.com/Kotlin/KEEP/blob/master/proposals/data-objects.md)
* YouTrack 问题：[KT-4107](https://youtrack.jetbrains.com/issue/KT-4107)
* 目标版本：1.9.0

</td>
</tr>

<tr filter="stable">
<td>

**稳定版**

</td>
<td>

**RangeUntil 运算符 `..<`**

* KEEP 提案：[open-ended-ranges.md](https://github.com/kotlin/KEEP/blob/open-ended-ranges/proposals/open-ended-ranges.md)
* YouTrack 问题：[KT-15613](https://youtrack.jetbrains.com/issue/KT-15613)
* 目标版本：1.7.20

</td>
</tr>

<tr filter="stable">
<td>

**稳定版**

</td>
<td>

**明确的非空类型**

* KEEP 提案：[definitely-non-nullable-types.md](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types.md)
* YouTrack 问题：[KT-26245](https://youtrack.jetbrains.com/issue/KT-26245)
* 目标版本：1.7.0

</td>
</tr>

<!-- END OF STABLE BLOCK -->

<!-- REVOKED BLOCK -->

<tr filter="revoked">
<td width="200">

**已撤销**

</td>
<td>

**上下文接收者**

* KEEP 提案：[context-receivers.md](https://github.com/Kotlin/KEEP/blob/master/proposals/context-receivers.md)
* YouTrack 问题：[KT-10468](https://youtrack.jetbrains.com/issue/KT-10468)

</td>
</tr>

</table>
</snippet>

<!-- END OF REVOKED BLOCK -->

</tab>

<tab id="exploration-and-design" title="探索与设计">

<include element-id="source" use-filter="empty,exploration-and-design" from="kotlin-language-features-and-proposals.md"/>

</tab>

<tab id="keep-preparation" title="KEEP 讨论">

<include element-id="source" use-filter="empty,keep" from="kotlin-language-features-and-proposals.md"/>

</tab>

<tab id="in-preview" title="预览中">

<include element-id="source" use-filter="empty,in-preview" from="kotlin-language-features-and-proposals.md"/>

</tab>

<tab id="stable" title="稳定版">

<include element-id="source" use-filter="empty,stable" from="kotlin-language-features-and-proposals.md"/>

</tab>

<tab id="revoked" title="已撤销">

<include element-id="source" use-filter="empty,revoked" from="kotlin-language-features-and-proposals.md"/>

</tab>
</tabs>