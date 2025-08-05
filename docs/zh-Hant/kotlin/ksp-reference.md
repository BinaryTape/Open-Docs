[//]: # (title: Java 註解處理與 KSP 的對照)

## 程式元素

| **Java** | **KSP 中的對應功能** | **備註** |
| -------- | --------------------------- | --------- |
| `AnnotationMirror` | `KSAnnotation` | |
| `AnnotationValue` | `KSValueArguments` | |
| `Element` | `KSDeclaration` / `KSDeclarationContainer` | |
| `ExecutableElement` | `KSFunctionDeclaration` | |
| `PackageElement` | `KSFile` | KSP 不將套件建模為程式元素 |
| `Parameterizable` | `KSDeclaration` | |
| `QualifiedNameable` | `KSDeclaration` | |
| `TypeElement` | `KSClassDeclaration` | |
| `TypeParameterElement` | `KSTypeParameter` | |
| `VariableElement` | `KSValueParameter` / `KSPropertyDeclaration` | |

## 類型

KSP 需要明確的類型解析，因此 Java 中的某些功能只能透過 `KSType` 及解析前對應的元素來實現。

| **Java** | **KSP 中的對應功能** | **備註** |
| -------- | --------------------------- | --------- |
| `ArrayType` | `KSBuiltIns.arrayType` | |
| `DeclaredType` | `KSType` / `KSClassifierReference` | |
| `ErrorType` | `KSType.isError` | |
| `ExecutableType` | `KSType` / `KSCallableReference` | |
| `IntersectionType` | `KSType` / `KSTypeParameter` | |
| `NoType` | `KSType.isError` | KSP 中不適用 |
| `NullType` | | KSP 中不適用 |
| `PrimitiveType` | `KSBuiltIns` | 與 Java 中的原始類型不完全相同 |
| `ReferenceType` | `KSTypeReference` | |
| `TypeMirror` | `KSType` | |
| `TypeVariable` | `KSTypeParameter` | |
| `UnionType` | N/A | Kotlin 每個 catch 區塊只有一種類型。`UnionType` 即使是 Java 註解處理器也無法觀察到。 |
| `WildcardType` | `KSType` / `KSTypeArgument` | |

## 其他

| **Java** | **KSP 中的對應功能** | **備註** |
| -------- | --------------------------- | --------- |
| `Name` | `KSName` | |
| `ElementKind` | `ClassKind` / `FunctionKind` | |
| `Modifier` | `Modifier` | |
| `NestingKind` | `ClassKind` / `FunctionKind` | |
| `AnnotationValueVisitor` |  | |
| `ElementVisitor` | `KSVisitor` | |
| `AnnotatedConstruct` | `KSAnnotated` | |
| `TypeVisitor` |  | |
| `TypeKind` | `KSBuiltIns` | 部分可在內建類型中找到，否則請檢查 `DeclaredType` 的 `KSClassDeclaration` |
| `ElementFilter` | `Collection.filterIsInstance` | |
| `ElementKindVisitor` | `KSVisitor` | |
| `ElementScanner` | `KSTopDownVisitor` | |
| `SimpleAnnotationValueVisitor` |  | KSP 中不需要 |
| `SimpleElementVisitor` | `KSVisitor` | |
| `SimpleTypeVisitor` |  | |
| `TypeKindVisitor` |  | |
| `Types` | `Resolver` / `utils` | 部分公用程式也整合到符號介面中 |
| `Elements` | `Resolver` / `utils` | |

## 細節

了解 Java 註解處理 API 的功能如何透過 KSP 來實現。

### AnnotationMirror

| **Java** | **KSP 對等物** |
| -------- | ------------------ |
| `getAnnotationType` | `ksAnnotation.annotationType` |
| `getElementValues` | `ksAnnotation.arguments` |

### AnnotationValue

| **Java** | **KSP 對等物** |
| -------- | ------------------ |
| `getValue` | `ksValueArgument.value` |

### Element

| **Java** | **KSP 對等物** |
| -------- | ------------------ |
| `asType` | `ksClassDeclaration.asType(...)` 僅適用於 `KSClassDeclaration`。需要提供類型參數。 |
| `getAnnotation` | 待實作 |
| `getAnnotationMirrors` | `ksDeclaration.annotations` |
| `getEnclosedElements` | `ksDeclarationContainer.declarations` |
| `getEnclosingElements` | `ksDeclaration.parentDeclaration` |
| `getKind` | 依照 `ClassKind` 或 `FunctionKind` 進行類型檢查和轉換 |
| `getModifiers` | `ksDeclaration.modifiers` |
| `getSimpleName` | `ksDeclaration.simpleName` |

### ExecutableElement

| **Java** | **KSP 對等物** |
| -------- | ------------------ |
| `getDefaultValue` | 待實作 |
| `getParameters` | `ksFunctionDeclaration.parameters` |
| `getReceiverType` | `ksFunctionDeclaration.parentDeclaration` |
| `getReturnType` | `ksFunctionDeclaration.returnType` |
| `getSimpleName` | `ksFunctionDeclaration.simpleName` |
| `getThrownTypes` | Kotlin 中不需要 |
| `getTypeParameters` | `ksFunctionDeclaration.typeParameters` |
| `isDefault` | 檢查父宣告是否為介面 |
| `isVarArgs` | `ksFunctionDeclaration.parameters.any { it.isVarArg }` |

### Parameterizable

| **Java** | **KSP 對等物** |
| -------- | ------------------ |
| `getTypeParameters` | `ksFunctionDeclaration.typeParameters` |

### QualifiedNameable

| **Java** | **KSP 對等物** |
| -------- | ------------------ |
| `getQualifiedName` | `ksDeclaration.qualifiedName` |

### TypeElement

<table>
    <tr>
        <td><b>Java</b></td>
        <td><b>KSP 對等物</b></td>
    </tr>
    <tr>
        <td><code>getEnclosedElements</code></td>
        <td><code>ksClassDeclaration.declarations</code></td>
    </tr>
    <tr>
        <td><code>getEnclosingElement</code></td>
        <td><code>ksClassDeclaration.parentDeclaration</code></td>
    </tr>
    <tr>
        <td><code>getInterfaces</code></td>
<td>

```kotlin
// Should be able to do without resolution
ksClassDeclaration.superTypes
    .map { it.resolve() }
    .filter { (it?.declaration as? KSClassDeclaration)?.classKind == ClassKind.INTERFACE }
```

</td>
    </tr>
    <tr>
        <td><code>getNestingKind</code></td>
        <td>檢查 <code>KSClassDeclaration.parentDeclaration</code> 和 <code>inner</code> 修飾符</td>
    </tr>
    <tr>
        <td><code>getQualifiedName</code></td>
        <td><code>ksClassDeclaration.qualifiedName</code></td>
    </tr>
    <tr>
        <td><code>getSimpleName</code></td>
        <td><code>ksClassDeclaration.simpleName</code></td>
    </tr>
    <tr>
        <td><code>getSuperclass</code></td>
<td>

```kotlin
// Should be able to do without resolution
ksClassDeclaration.superTypes
    .map { it.resolve() }
    .filter { (it?.declaration as? KSClassDeclaration)?.classKind == ClassKind.CLASS }
```

</td>
    </tr>
    <tr>
        <td><code>getTypeParameters</code></td>
        <td><code>ksClassDeclaration.typeParameters</code></td>
    </tr>
</table>

### TypeParameterElement

| **Java** | **KSP 對等物** |
| -------- | ------------------ |
| `getBounds` | `ksTypeParameter.bounds` |
| `getEnclosingElement` | `ksTypeParameter.parentDeclaration` |
| `getGenericElement` | `ksTypeParameter.parentDeclaration` |

### VariableElement

| **Java** | **KSP 對等物** |
| -------- | ------------------ |
| `getConstantValue` | 待實作 |
| `getEnclosingElement` | `ksValueParameter.parentDeclaration` |
| `getSimpleName` | `ksValueParameter.simpleName` |

### ArrayType

| **Java** | **KSP 對等物** |
| -------- | ------------------ |
| `getComponentType` | `ksType.arguments.first()` |

### DeclaredType

| **Java** | **KSP 對等物** |
| -------- | ------------------ |
| `asElement` | `ksType.declaration` |
| `getEnclosingType` | `ksType.declaration.parentDeclaration` |
| `getTypeArguments` | `ksType.arguments` |

### ExecutableType

> 函數的 `KSType` 只是由 `FunctionN<R, T1, T2, ..., TN>` 家族表示的簽名。
>
{style="note"}

| **Java** | **KSP 對等物** |
| -------- | ------------------ |
| `getParameterTypes` | `ksType.declaration.typeParameters`, `ksFunctionDeclaration.parameters.map { it.type }` |
| `getReceiverType` | `ksFunctionDeclaration.parentDeclaration.asType(...)` |
| `getReturnType` | `ksType.declaration.typeParameters.last()` |
| `getThrownTypes` | Kotlin 中不需要 |
| `getTypeVariables` | `ksFunctionDeclaration.typeParameters` |

### IntersectionType

| **Java** | **KSP 對等物** |
| -------- | ------------------ |
| `getBounds` | `ksTypeParameter.bounds` |

### TypeMirror

| **Java** | **KSP 對等物** |
| -------- | ------------------ |
| `getKind` | 與 `KSBuiltIns` 中的類型比較，適用於原始類型、`Unit` 類型，否則為宣告類型 |

### TypeVariable

| **Java** | **KSP 對等物** |
| -------- | ------------------ |
| `asElement` | `ksType.declaration` |
| `getLowerBound` | 待定。僅在提供捕獲且需要明確的界限檢查時才需要。 |
| `getUpperBound` | `ksTypeParameter.bounds` |

### WildcardType

<table>
    <tr>
        <td><b>Java</b></td>
        <td><b>KSP 對等物</b></td>
    </tr>
    <tr>
        <td><code>getExtendsBound</code></td>
<td>

```kotlin
if (ksTypeArgument.variance == Variance.COVARIANT) ksTypeArgument.type else null
```

</td>
    </tr>
    <tr>
        <td><code>getSuperBound</code></td>
<td>

```kotlin
if (ksTypeArgument.variance == Variance.CONTRAVARIANT) ksTypeArgument.type else null
```

</td>
    </tr>
</table>

### Elements

<table>
    <tr>
        <td><b>Java</b></td>
        <td><b>KSP 對等物</b></td>
    </tr>
    <tr>
        <td><code>getAllAnnotationMirrors</code></td>
        <td><code>KSDeclarations.annotations</code></td>
    </tr>
    <tr>
        <td><code>getAllMembers</code></td>
        <td><code>getAllFunctions</code>, <code>getAllProperties</code> 待實作</td>
    </tr>
    <tr>
        <td><code>getBinaryName</code></td>
        <td>待定，參閱 <a href="https://docs.oracle.com/javase/specs/jls/se13/html/jls-13.html#jls-13.1">Java 規範</a></td>
    </tr>
    <tr>
        <td><code>getConstantExpression</code></td>
        <td>存在常數值，而非表達式</td>
    </tr>
    <tr>
        <td><code>getDocComment</code></td>
        <td>待實作</td>
    </tr>
    <tr>
        <td><code>getElementValuesWithDefaults</code></td>
        <td>待實作</td>
    </tr>
    <tr>
        <td><code>getName</code></td>
        <td><code>resolver.getKSNameFromString</code></td>
    </tr>
    <tr>
        <td><code>getPackageElement</code></td>
        <td>不支援套件，但套件資訊可被檢索。KSP 無法對套件執行操作。</td>
    </tr>
    <tr>
        <td><code>getPackageOf</code></td>
        <td>不支援套件</td>
    </tr>
    <tr>
        <td><code>getTypeElement</code></td>
        <td><code>Resolver.getClassDeclarationByName</code></td>
    </tr>
    <tr>
        <td><code>hides</code></td>
        <td>待實作</td>
    </tr>
    <tr>
        <td><code>isDeprecated</code></td>
<td>

```kotlin
KsDeclaration.annotations.any { 
    it.annotationType.resolve()!!.declaration.qualifiedName!!.asString() == Deprecated::class.qualifiedName
}
```

</td>
    </tr>
    <tr>
        <td><code>overrides</code></td>
        <td><code>KSFunctionDeclaration.overrides</code> / <code>KSPropertyDeclaration.overrides</code> (各自類別的成員函數)</td>
    </tr>
    <tr>
        <td><code>printElements</code></td>
        <td>KSP 在大多數類別上具有基本的 <code>toString()</code> 實作</td>
    </tr>
</table>

### Types
{id="type-operations"}

| **Java** | **KSP 對等物** |
| -------- | ------------------ |
| `asElement` | `ksType.declaration` |
| `asMemberOf` | `resolver.asMemberOf` |
| `boxedClass` | 不需要 |
| `capture` | 待定 |
| `contains` | `KSType.isAssignableFrom` |
| `directSuperTypes` | `(ksType.declaration as KSClassDeclaration).superTypes` |
| `erasure` | `ksType.starProjection()` |
| `getArrayType` | `ksBuiltIns.arrayType.replace(...)` |
| `getDeclaredType` | `ksClassDeclaration.asType` |
| `getNoType` | `ksBuiltIns.nothingType` / `null` |
| `getNullType` | 取決於上下文，`KSType.markNullable` 可能有用 |
| `getPrimitiveType` | 不需要，檢查 `KSBuiltins` |
| `getWildcardType` | 在預期 `KSTypeArgument` 的位置使用 `Variance` |
| `isAssignable` | `ksType.isAssignableFrom` |
| `isSameType` | `ksType.equals` |
| `isSubsignature` | `functionTypeA == functionTypeB` / `functionTypeA == functionTypeB.starProjection()` |
| `isSubtype` | `ksType.isAssignableFrom` |
| `unboxedType` | 不需要 |