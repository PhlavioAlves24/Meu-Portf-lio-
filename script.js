document.addEventListener('DOMContentLoaded', function() {
    // Inicializa AOS (Animate On Scroll)
    // Será inicializado em qualquer página que inclua a biblioteca AOS.js e este script.
    // Certifique-se de que AOS.js está incluído no HTML das páginas de detalhe também.
    if (typeof AOS !== 'undefined') { // Verifica se a biblioteca AOS foi carregada
        AOS.init({
            duration: 800, // Duração da animação
            once: true,    // Animação acontece apenas uma vez
            offset: 100,   // Offset (em px) do trigger point original
            delay: 50,     // Valores de 0 a 3000, com passo de 50ms
        });
    }


    // Atualiza o ano no rodapé
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Smooth scroll para links da navbar e fechamento do menu mobile
    const navLinks = document.querySelectorAll('#mainNavbar .nav-link');
    const navbarToggler = document.querySelector('#mainNavbar .navbar-toggler');
    const mainNavbarElement = document.getElementById('mainNavbar'); // Pegar o elemento da navbar
    const navbarCollapse = document.getElementById('navbarNav');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const linkHref = this.getAttribute('href');

            // Verifica se é um link interno para a página atual (começa com #)
            // ou um link para uma seção em index.html (contém index.html#)
            if (linkHref.startsWith('#') || linkHref.includes('index.html#')) {
                // Se for um link para index.html#secao de outra página (ex: projeto-detalhe.html -> index.html#projetos)
                if (linkHref.includes('index.html#') && !window.location.pathname.endsWith('index.html') && !window.location.pathname.endsWith('/')) {
                    // Apenas navega para index.html e deixa o navegador lidar com o hash
                    // Não previne o default, deixa o navegador ir para index.html#secao
                } else {
                    // Se for um link interno na mesma página (index.html ou qualquer outra com seções internas)
                    e.preventDefault();
                    const hash = this.hash; // this.hash pega a parte # do href
                    const targetElement = document.querySelector(hash);

                    if (targetElement) {
                        const navbarHeight = mainNavbarElement ? mainNavbarElement.offsetHeight : 70; // Usa o elemento da navbar
                        
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth"
                        });

                        // Atualiza o link ativo na navbar (opcional, mas bom para UX)
                        navLinks.forEach(nav => nav.classList.remove('active'));
                        this.classList.add('active');
                    }
                }
            } else {
                // Se for um link para outra página (ex: index.html, projeto-detalhe.html),
                // apenas deixa a navegação padrão ocorrer.
                // Poderia adicionar lógica para fechar o menu aqui também, se necessário.
            }

            // Fecha o menu hamburguer (se estiver aberto e visível)
            if (navbarToggler && navbarCollapse.classList.contains('show')) {
                const bsCollapseInstance = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapseInstance) {
                    bsCollapseInstance.hide();
                } else {
                    // Fallback caso getInstance retorne null (raro, mas para segurança)
                    // A classe 'collapsed' no toggler é gerenciada pelo Bootstrap.
                    // Só precisamos verificar se o 'show' está no collapse.
                    if (!navbarToggler.classList.contains('collapsed')) {
                         navbarToggler.click();
                    }
                }
            }
        });
    });

    // Adicionar classe 'navbar-scrolled' à navbar ao rolar
    if (mainNavbarElement) {
        const handleNavbarScroll = () => {
            if (window.scrollY > 50) {
                mainNavbarElement.classList.add('navbar-scrolled');
            } else {
                mainNavbarElement.classList.remove('navbar-scrolled');
            }
        };
        handleNavbarScroll(); // Executa no load
        window.addEventListener('scroll', handleNavbarScroll);
    }

    // Lógica para ativar o link da navbar com base no scroll (Spy)
    // Isso pode ser mais complexo se as seções não tiverem altura suficiente
    // ou se a navbar tiver offset variável. Bootstrap Spy já cuida disso.
    // Se estiver usando data-bs-spy="scroll" no body e data-bs-target na navbar,
    // o Bootstrap deve cuidar da ativação dos links automaticamente.
    // O código abaixo é um exemplo de como você poderia fazer manualmente,
    // mas o data-bs-spy é geralmente preferível.

    // Verifique se o `body` tem `data-bs-spy="scroll"`. Se sim, o Bootstrap já faz isso.
    // Se não, você pode adicionar um código como este (mas precisaria ajustar):
    /*
    const sections = document.querySelectorAll('section[id]'); // Pega todas as seções com ID
    window.addEventListener('scroll', () => {
        let current = '';
        const navbarHeight = mainNavbarElement ? mainNavbarElement.offsetHeight : 70;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 10; // -10 para um pequeno buffer
            if (pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current) && current !== '') {
                link.classList.add('active');
            } else if (current === '' && link.getAttribute('href').endsWith('#home')) {
                // Caso especial para o topo da página / link "Início"
                link.classList.add('active');
            }
        });
        // Se nenhum 'current' for encontrado (ex: no topo antes da primeira seção com ID),
        // certifique-se de que o link 'Início' está ativo se for o caso.
        if (current === '' && pageYOffset < (sections[0] ? sections[0].offsetTop - navbarHeight : 500) ) {
             const homeLink = document.querySelector('.nav-link[href$="#home"]');
             if(homeLink) homeLink.classList.add('active');
        }
    });
    */

});