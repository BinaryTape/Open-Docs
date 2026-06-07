[//]: # (title: Kotlin 语言功能与提案)

<web-summary>了解 Kotlin 功能的生命周期。本页包含 Kotlin 语言功能和设计提案的完整列表。</web-summary>

JetBrains 根据 [Kotlin 语言演进原则](kotlin-evolution-principles.md)，在务实设计的指导下演进 Kotlin 语言。

> 语言功能提案自 Kotlin 1.7.0 起列出。
>
> 参阅 [Kotlin 演进原则文档](kotlin-evolution-principles.md#pre-stable-features)中关于语言功能状态的说明。
>
{style="note"}

<tabs>
<tab id="all-proposals" title="全部">

<!-- <include element-id="all-proposals" from="all-proposals.topic"/> -->

<snippet id="source">
<table style="header-column">

<!-- the first td element should have the width="200" attribute -->

<!-- EXPLORATION AND DESIGN BLOCK -->

<tr filter="exploration-and-design">
<td width="200">

**探索与设计**

</td>
<td>

**基于名称的析构**

* KEEP 提案：[name-based-destructuring.md](https://github.com/Kotlin/KEEP/blob/name-based-destructuring/proposals/name-based-destructuring.md)
* YouTrack 问题：[KT-19627](https://youtrack.jetbrains.com/issue/KT-19627)

</td>
</tr>

<tr filter="exploration-and-design">
<td>

**探索与设计**

</td>
<td>

**支持不可变性**

* KEEP 笔记：[immutability](https://github.com/Kotlin/KEEP/blob/master/notes/value-classes.md#immutability-and-value-classes)
* YouTrack 问题：[KT-77734](https://youtrack.jetbrains.com/issue/KT-77734)

</td>
</tr>

<!-- END OF EXPLORATION AND DESIGN BLOCK -->

<!-- KEEP DISCUSSION BLOCK -->

<tr filter="keep">
<td width="200">

**KEEP 讨论**

</td>
<td>

**改进编译时常量**

* KEEP 提案：[improve-compile-time-constants.md](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0444-improve-compile-time-constants.md)
* YouTrack 问题：[KT-22505](https://youtrack.jetbrains.com/issue/KT-22505)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 讨论**

</td>
<td>

**`CoroutineContext` 作为上下文参数**

* KEEP 提案：[CoroutineContext-context-parameter.md](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0443-suspend-CoroutineContext-context-parameter.md)
* YouTrack 问题：[KT-15555](https://youtrack.jetbrains.com/issue/KT-15555)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 讨论**

</td>
<td>

**富错误 (Rich Errors)：动机与原理**

* KEEP 提案：[rich-errors-motivation.md](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0441-rich-errors-motivation.md)
* YouTrack 问题：[KT-68296](https://youtrack.jetbrains.com/issue/KT-68296)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 讨论**

</td>
<td>

**Kotlin 静态成员与静态扩展**

* KEEP 提案：[statics.md](https://github.com/Kotlin/KEEP/blob/static-scope/proposals/static-member-type-extension.md)
* YouTrack 问题：[KT-11968](https://youtrack.jetbrains.com/issue/KT-11968)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 讨论**

</td>
<td>

**集合字面量**

* KEEP 提案：[collection-literals.md](https://github.com/Kotlin/KEEP/blob/bobko/collection-literals/proposals/collection-literals.md)
* YouTrack 问题：[KT-43871](https://youtrack.jetbrains.com/issue/KT-43871)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 讨论**

</td>
<td>

**版本重载**

* KEEP 提案：[version-overloading.md](https://github.com/Kotlin/KEEP/blob/version-overloading-proposal/proposals/version-overloading.md)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 讨论**

</td>
<td>

**精简 KDoc 歧义链接**

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

<!-- END OF KEEP DISCUSSION BLOCK -->

<!-- IN PREVIEW BLOCK -->

<tr filter="in-preview">
<td width="200">

**预览中**

</td>
<td>

**显式支持字段**

* KEEP 提案：[explicit-backing-fields.md](https://github.com/Kotlin/KEEP/blob/explicit-backing-fields/proposals/explicit-backing-fields.md)
* YouTrack 问题：[KT-14663](https://youtrack.jetbrains.com/issue/KT-14663)
* 稳定性级别：[实验性](components-stability.md#stability-levels-explained)
* 自以下版本起可用：2.3.0

</td>
</tr>

<tr filter="in-preview">
<td>

**预览中**

</td>
<td>

**上下文参数：支持上下文相关的声明**

* KEEP 提案：[context-parameters.md](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md)
* YouTrack 问题：[KT-10468](https://youtrack.jetbrains.com/issue/KT-10468)
* 稳定性级别：[实验性](components-stability.md#stability-levels-explained)
* 自以下版本起可用：2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**预览中**

</td>
<td>

**未使用返回值检查器**

* KEEP 提案：[unused-return-value-checker.md](https://github.com/Kotlin/KEEP/blob/underscore-for-unused-local/proposals/unused-return-value-checker.md)
* YouTrack 问题：[KT-12719](https://youtrack.jetbrains.com/issue/KT-12719)
* 稳定性级别：[实验性](components-stability.md#stability-levels-explained)
* 自以下版本起可用：2.3.0

</td>
</tr>

<tr filter="in-preview">
<td>

**预览中**

</td>
<td>

**属性上注解使用处目标的改进**

* KEEP 提案：[Improvements to annotation use-site targets on properties](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-target-in-properties.md)
* YouTrack 问题：[KT-73255](https://youtrack.jetbrains.com/issue/KT-73255)
* 稳定性级别：[实验性](components-stability.md#stability-levels-explained)
* 自以下版本起可用：2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**预览中**

</td>
<td>

**上下文相关解析**

* KEEP 提案：[context-sensitive-resolution.md](https://github.com/Kotlin/KEEP/blob/improved-resolution-expected-type/proposals/context-sensitive-resolution.md)
* YouTrack 问题：[KT-16768](https://youtrack.jetbrains.com/issue/KT-16768)
* 稳定性级别：[实验性](components-stability.md#stability-levels-explained)
* 自以下版本起可用：2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**预览中**

</td>
<td>

**在 JVM 中公开装箱的内联值类**

* KEEP 提案：[jvm-expose-boxed.md](https://github.com/Kotlin/KEEP/blob/jvm-expose-boxed/proposals/jvm-expose-boxed.md)
* YouTrack 问题：[KT-28135](https://youtrack.jetbrains.com/issue/KT-28135)
* 稳定性级别：[实验性](components-stability.md#stability-levels-explained)
* 自以下版本起可用：2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**预览中**

</td>
<td>

**Uuid**

* KEEP 提案：[uuid.md](https://github.com/Kotlin/KEEP/blob/uuid/proposals/stdlib/uuid.md)
* YouTrack 问题：[KT-31880](https://youtrack.jetbrains.com/issue/KT-31880)
* 稳定性级别：[实验性](components-stability.md#stability-levels-explained)
* 自以下版本起可用：2.0.20

</td>
</tr>

<tr filter="in-preview">
<td>

**预览中**

</td>
<td>

**通用原子类与原子数组**

* KEEP 提案：[Common atomics](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/common-atomics.md)
* YouTrack 问题：[KT-62423](https://youtrack.jetbrains.com/issue/KT-62423)
* 稳定性级别：[实验性](components-stability.md#stability-levels-explained)
* 自以下版本起可用：2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**预览中**

</td>
<td>

**KMP Kotlin 到 Java 直接实际化**

* KEEP 提案：[kmp-kotlin-to-java-direct-actualization.md](https://github.com/Kotlin/KEEP/blob/kotlin-to-java-direct-actualization/proposals/kmp-kotlin-to-java-direct-actualization.md)
* YouTrack 问题：[KT-67202](https://youtrack.jetbrains.com/issue/KT-67202)
* 稳定性级别：[实验性](components-stability.md#stability-levels-explained)
* 自以下版本起可用：2.1.0

</td>
</tr>

<!-- END OF IN PREVIEW BLOCK -->

<!-- STABLE BLOCK -->

<tr filter="stable">
<td width="200">

**稳定版**

</td>
<td>

**基于数据流的穷举性检查**

* KEEP 提案：[dfa-exhaustiveness.md](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0442-dfa-exhaustiveness.md)
* YouTrack 问题：[KT-8781](https://youtrack.jetbrains.com/issue/KT-8781)
* 自 2.2.20 起可用，自 2.3.0 起稳定

</td>
</tr>

<tr filter="stable">
<td>

**稳定版**

</td>
<td>

**嵌套（非捕获）类型别名**

* KEEP 提案：[Nested (non-capturing) type aliases](https://github.com/Kotlin/KEEP/blob/master/proposals/nested-typealias.md)
* YouTrack 问题：[KT-45285](https://youtrack.jetbrains.com/issue/KT-45285)
* 自 2.2.0 起可用，自 2.3.0 起稳定

</td>
</tr>

<tr filter="stable">
<td>

**稳定版**

</td>
<td>

**kotlin.time.Instant**

* KEEP 提案：[Instant and Clock](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/instant.md)
* YouTrack 问题：[KT-80778](https://youtrack.jetbrains.com/issue/KT-80778)
* 自 2.1.0 起可用，自 2.3.0 起稳定

</td>
</tr>

<tr filter="stable">
<td>

**稳定版**

</td>
<td>

**带主语 when 中的守护条件**

* KEEP 提案：[guards.md](https://github.com/Kotlin/KEEP/blob/guards/proposals/guards.md)
* YouTrack 问题：[KT-13626](https://youtrack.jetbrains.com/issue/KT-13626)
* 自以下版本起可用：2.2.0

</td>
</tr>

<tr filter="stable">
<td>

**稳定版**

</td>
<td>

**多美元插值：改进字符串文字中 $ 的处理**

* KEEP 提案：[dollar-escape.md](https://github.com/Kotlin/KEEP/blob/master/proposals/dollar-escape.md)
* YouTrack 问题：[KT-2425](https://youtrack.jetbrains.com/issue/KT-2425)
* 自以下版本起可用：2.2.0

</td>
</tr>

<tr filter="stable">
<td>

**稳定版**

</td>
<td>

**非局部 `break` 与 `continue`**

* KEEP 提案：[break-continue-in-inline-lambdas.md](https://github.com/Kotlin/KEEP/blob/master/proposals/break-continue-in-inline-lambdas.md)
* YouTrack 问题：[KT-1436](https://youtrack.jetbrains.com/issue/KT-1436)
* 自以下版本起可用：2.2.0

</td>
</tr>

<tr filter="stable">
<td>

**稳定版**

</td>
<td>

**稳定版 `@SubclassOptInRequired`**

* KEEP 提案：[subclass-opt-in-required.md](https://github.com/Kotlin/KEEP/blob/master/proposals/subclass-opt-in-required.md)
* YouTrack 问题：[KT-54617](https://youtrack.jetbrains.com/issue/KT-54617)
* 自以下版本起可用：2.1.0

</td>
</tr>

<tr filter="stable">
<td width="200">

**稳定版**

</td>
<td>

**`Enum.entries`：`Enum.values()` 的高性能替代方案**

* KEEP 提案：[enum-entries.md](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md)
* YouTrack 问题：[KT-48872](https://youtrack.jetbrains.com/issue/KT-48872)
* 自以下版本起可用：2.0.0

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
* 自以下版本起可用：1.9.0

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
* 自以下版本起可用：1.7.20

</td>
</tr>

<tr filter="stable">
<td>

**稳定版**

</td>
<td>

**绝对不可为空类型**

* KEEP 提案：[definitely-non-nullable-types.md](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types.md)
* YouTrack 问题：[KT-26245](https://youtrack.jetbrains.com/issue/KT-26245)
* 自以下版本起可用：1.7.0

</td>
</tr>

<!-- END OF STABLE BLOCK -->

<!-- REVOKED BLOCK -->

<tr filter="revoked">
<td width="200">

**已撤销**

</td>
<td>

**上下文接收器**

* KEEP 提案：[context-receivers.md](https://github.com/Kotlin/KEEP/blob/master/proposals/context-receivers.md)
* YouTrack 问题：[KT-10468](https://youtrack.jetbrains.com/issue/KT-10468)
* 替换为 [context-parameters.md](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md)

</td>
</tr>

<tr filter="revoked">
<td>

**已撤销**

</td>
<td>

**Java 合成属性引用**

* KEEP 提案：[references-to-java-synthetic-properties.md](https://github.com/Kotlin/KEEP/blob/master/proposals/references-to-java-synthetic-properties.md)
* YouTrack 问题：[KT-8575](https://youtrack.jetbrains.com/issue/KT-8575)

</td>
</tr>

</table>
</snippet>

<!-- END OF REVOKED BLOCK -->

</tab>

<tab id="exploration-and-design" title="探索与设计">

<table>
<tr filter="exploration-and-design">
<td width="200">

**探索与设计**

</td>
<td>

**基于名称的析构**

* KEEP 提案：[name-based-destructuring.md](https://github.com/Kotlin/KEEP/blob/name-based-destructuring/proposals/name-based-destructuring.md)
* YouTrack 问题：[KT-19627](https://youtrack.jetbrains.com/issue/KT-19627)

</td>
</tr>

<tr filter="exploration-and-design">
<td>

**探索与设计**

</td>
<td>

**支持不可变性**

* KEEP 笔记：[immutability](https://github.com/Kotlin/KEEP/blob/master/notes/value-classes.md#immutability-and-value-classes)
* YouTrack 问题：[KT-77734](https://youtrack.jetbrains.com/issue/KT-77734)

</td>
</tr>
</table>

</tab>

<tab id="keep-preparation" title="KEEP 讨论">

<table>
<tr filter="keep">
<td width="200">

**KEEP 讨论**

</td>
<td>

**改进编译时常量**

* KEEP 提案：[improve-compile-time-constants.md](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0444-improve-compile-time-constants.md)
* YouTrack 问题：[KT-22505](https://youtrack.jetbrains.com/issue/KT-22505)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 讨论**

</td>
<td>

**`CoroutineContext` 作为上下文参数**

* KEEP 提案：[CoroutineContext-context-parameter.md](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0443-suspend-CoroutineContext-context-parameter.md)
* YouTrack 问题：[KT-15555](https://youtrack.jetbrains.com/issue/KT-15555)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 讨论**

</td>
<td>

**富错误 (Rich Errors)：动机与原理**

* KEEP 提案：[rich-errors-motivation.md](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0441-rich-errors-motivation.md)
* YouTrack 问题：[KT-68296](https://youtrack.jetbrains.com/issue/KT-68296)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 讨论**

</td>
<td>

**Kotlin 静态成员与静态扩展**

* KEEP 提案：[statics.md](https://github.com/Kotlin/KEEP/blob/static-scope/proposals/static-member-type-extension.md)
* YouTrack 问题：[KT-11968](https://youtrack.jetbrains.com/issue/KT-11968)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 讨论**

</td>
<td>

**集合字面量**

* KEEP 提案：[collection-literals.md](https://github.com/Kotlin/KEEP/blob/bobko/collection-literals/proposals/collection-literals.md)
* YouTrack 问题：[KT-43871](https://youtrack.jetbrains.com/issue/KT-43871)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 讨论**

</td>
<td>

**版本重载**

* KEEP 提案：[version-overloading.md](https://github.com/Kotlin/KEEP/blob/version-overloading-proposal/proposals/version-overloading.md)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 讨论**

</td>
<td>

**精简 KDoc 歧义链接**

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
</table>

</tab>

<tab id="in-preview" title="预览中">

<table>
<tr filter="in-preview">
<td width="200">

**预览中**

</td>
<td>

**显式支持字段**

* KEEP 提案：[explicit-backing-fields.md](https://github.com/Kotlin/KEEP/blob/explicit-backing-fields/proposals/explicit-backing-fields.md)
* YouTrack 问题：[KT-14663](https://youtrack.jetbrains.com/issue/KT-14663)
* 稳定性级别：[实验性](components-stability.md#stability-levels-explained)
* 自以下版本起可用：2.3.0

</td>
</tr>

<tr filter="in-preview">
<td>

**预览中**

</td>
<td>

**上下文参数：支持上下文相关的声明**

* KEEP 提案：[context-parameters.md](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md)
* YouTrack 问题：[KT-10468](https://youtrack.jetbrains.com/issue/KT-10468)
* 稳定性级别：[实验性](components-stability.md#stability-levels-explained)
* 自以下版本起可用：2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**预览中**

</td>
<td>

**未使用返回值检查器**

* KEEP 提案：[unused-return-value-checker.md](https://github.com/Kotlin/KEEP/blob/underscore-for-unused-local/proposals/unused-return-value-checker.md)
* YouTrack 问题：[KT-12719](https://youtrack.jetbrains.com/issue/KT-12719)
* 稳定性级别：[实验性](components-stability.md#stability-levels-explained)
* 自以下版本起可用：2.3.0

</td>
</tr>

<tr filter="in-preview">
<td>

**预览中**

</td>
<td>

**属性上注解使用处目标的改进**

* KEEP 提案：[Improvements to annotation use-site targets on properties](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-target-in-properties.md)
* YouTrack 问题：[KT-73255](https://youtrack.jetbrains.com/issue/KT-73255)
* 稳定性级别：[实验性](components-stability.md#stability-levels-explained)
* 自以下版本起可用：2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**预览中**

</td>
<td>

**上下文相关解析**

* KEEP 提案：[context-sensitive-resolution.md](https://github.com/Kotlin/KEEP/blob/improved-resolution-expected-type/proposals/context-sensitive-resolution.md)
* YouTrack 问题：[KT-16768](https://youtrack.jetbrains.com/issue/KT-16768)
* 稳定性级别：[实验性](components-stability.md#stability-levels-explained)
* 自以下版本起可用：2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**预览中**

</td>
<td>

**在 JVM 中公开装箱的内联值类**

* KEEP 提案：[jvm-expose-boxed.md](https://github.com/Kotlin/KEEP/blob/jvm-expose-boxed/proposals/jvm-expose-boxed.md)
* YouTrack 问题：[KT-28135](https://youtrack.jetbrains.com/issue/KT-28135)
* 稳定性级别：[实验性](components-stability.md#stability-levels-explained)
* 自以下版本起可用：2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**预览中**

</td>
<td>

**Uuid**

* KEEP 提案：[uuid.md](https://github.com/Kotlin/KEEP/blob/uuid/proposals/stdlib/uuid.md)
* YouTrack 问题：[KT-31880](https://youtrack.jetbrains.com/issue/KT-31880)
* 稳定性级别：[实验性](components-stability.md#stability-levels-explained)
* 自以下版本起可用：2.0.20

</td>
</tr>

<tr filter="in-preview">
<td>

**预览中**

</td>
<td>

**通用原子类与原子数组**

* KEEP 提案：[Common atomics](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/common-atomics.md)
* YouTrack 问题：[KT-62423](https://youtrack.jetbrains.com/issue/KT-62423)
* 稳定性级别：[实验性](components-stability.md#stability-levels-explained)
* 自以下版本起可用：2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**预览中**

</td>
<td>

**KMP Kotlin 到 Java 直接实际化**

* KEEP 提案：[kmp-kotlin-to-java-direct-actualization.md](https://github.com/Kotlin/KEEP/blob/kotlin-to-java-direct-actualization/proposals/kmp-kotlin-to-java-direct-actualization.md)
* YouTrack 问题：[KT-67202](https://youtrack.jetbrains.com/issue/KT-67202)
* 稳定性级别：[实验性](components-stability.md#stability-levels-explained)
* 自以下版本起可用：2.1.0

</td>
</tr>
</table>

</tab>

<tab id="stable" title="稳定版">

<table>
<tr filter="stable">
<td width="200">

**稳定版**

</td>
<td>

**基于数据流的穷举性检查**

* KEEP 提案：[dfa-exhaustiveness.md](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0442-dfa-exhaustiveness.md)
* YouTrack 问题：[KT-8781](https://youtrack.jetbrains.com/issue/KT-8781)
* 自 2.2.20 起可用，自 2.3.0 起稳定

</td>
</tr>

<tr filter="stable">
<td>

**稳定版**

</td>
<td>

**嵌套（非捕获）类型别名**

* KEEP 提案：[Nested (non-capturing) type aliases](https://github.com/Kotlin/KEEP/blob/master/proposals/nested-typealias.md)
* YouTrack 问题：[KT-45285](https://youtrack.jetbrains.com/issue/KT-45285)
* 自 2.2.0 起可用，自 2.3.0 起稳定

</td>
</tr>

<tr filter="stable">
<td>

**稳定版**

</td>
<td>

**kotlin.time.Instant**

* KEEP 提案：[Instant and Clock](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/instant.md)
* YouTrack 问题：[KT-80778](https://youtrack.jetbrains.com/issue/KT-80778)
* 自 2.1.0 起可用，自 2.3.0 起稳定

</td>
</tr>

<tr filter="stable">
<td>

**稳定版**

</td>
<td>

**带主语 when 中的守护条件**

* KEEP 提案：[guards.md](https://github.com/Kotlin/KEEP/blob/guards/proposals/guards.md)
* YouTrack 问题：[KT-13626](https://youtrack.jetbrains.com/issue/KT-13626)
* 自以下版本起可用：2.2.0

</td>
</tr>

<tr filter="stable">
<td>

**稳定版**

</td>
<td>

**多美元插值：改进字符串文字中 $ 的处理**

* KEEP 提案：[dollar-escape.md](https://github.com/Kotlin/KEEP/blob/master/proposals/dollar-escape.md)
* YouTrack 问题：[KT-2425](https://youtrack.jetbrains.com/issue/KT-2425)
* 自以下版本起可用：2.2.0

</td>
</tr>

<tr filter="stable">
<td>

**稳定版**

</td>
<td>

**非局部 `break` 与 `continue`**

* KEEP 提案：[break-continue-in-inline-lambdas.md](https://github.com/Kotlin/KEEP/blob/master/proposals/break-continue-in-inline-lambdas.md)
* YouTrack 问题：[KT-1436](https://youtrack.jetbrains.com/issue/KT-1436)
* 自以下版本起可用：2.2.0

</td>
</tr>

<tr filter="stable">
<td>

**稳定版**

</td>
<td>

**稳定版 `@SubclassOptInRequired`**

* KEEP 提案：[subclass-opt-in-required.md](https://github.com/Kotlin/KEEP/blob/master/proposals/subclass-opt-in-required.md)
* YouTrack 问题：[KT-54617](https://youtrack.jetbrains.com/issue/KT-54617)
* 自以下版本起可用：2.1.0

</td>
</tr>

<tr filter="stable">
<td width="200">

**稳定版**

</td>
<td>

**`Enum.entries`：`Enum.values()` 的高性能替代方案**

* KEEP 提案：[enum-entries.md](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md)
* YouTrack 问题：[KT-48872](https://youtrack.jetbrains.com/issue/KT-48872)
* 自以下版本起可用：2.0.0

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
* 自以下版本起可用：1.9.0

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
* 自以下版本起可用：1.7.20

</td>
</tr>

<tr filter="stable">
<td>

**稳定版**

</td>
<td>

**绝对不可为空类型**

* KEEP 提案：[definitely-non-nullable-types.md](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types.md)
* YouTrack 问题：[KT-26245](https://youtrack.jetbrains.com/issue/KT-26245)
* 自以下版本起可用：1.7.0

</td>
</tr>
</table>

</tab>

<tab id="revoked" title="已撤销">

<table>
<tr filter="revoked">
<td width="200">

**已撤销**

</td>
<td>

**上下文接收器**

* KEEP 提案：[context-receivers.md](https://github.com/Kotlin/KEEP/blob/master/proposals/context-receivers.md)
* YouTrack 问题：[KT-10468](https://youtrack.jetbrains.com/issue/KT-10468)
* 替换为 [context-parameters.md](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md)

</td>
</tr>

<tr filter="revoked">
<td>

**已撤销**

</td>
<td>

**Java 合成属性引用**

* KEEP 提案：[references-to-java-synthetic-properties.md](https://github.com/Kotlin/KEEP/blob/master/proposals/references-to-java-synthetic-properties.md)
* YouTrack 问题：[KT-8575](https://youtrack.jetbrains.com/issue/KT-8575)

</td>
</tr>
</table>

</tab>
</tabs>