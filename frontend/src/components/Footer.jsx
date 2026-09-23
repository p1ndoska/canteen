import { ClockIcon, MailIcon, PhoneIcon, PinIcon } from '../ui'

const linkClass = 'text-sm text-white/70 transition hover:text-white xl:text-base'

export default function Footer({ onTabChange }) {
  return (
    <footer className="mt-auto bg-[#213659] text-white">
      <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-4 py-10 xl:max-w-[1440px] xl:py-12 sm:grid-cols-2 lg:grid-cols-3">
        <section>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/90 xl:text-base">
            Контакты
          </h3>
          <ul className="flex flex-col gap-2.5 text-sm text-white/70 xl:text-base">
            <li className="flex items-center gap-2.5">
              <PhoneIcon className="h-4 w-4 shrink-0 text-white/50" />
              +375 (17) 215-40-52
            </li>
            <li className="flex items-center gap-2.5">
              <PhoneIcon className="h-4 w-4 shrink-0 text-white/50" />
              +375 (17) 213-41-60 (факс)
            </li>
            <li className="flex items-center gap-2.5">
              <MailIcon className="h-4 w-4 shrink-0 text-white/50" />
              stolovaya@mvd.gov.by
            </li>
            <li className="flex items-start gap-2.5">
              <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-white/50" />
              Адрес: г. Минск, ул. Городской Вал, 8
            </li>
            <li className="flex items-center gap-2.5">
              <ClockIcon className="h-4 w-4 shrink-0 text-white/50" />
              Время работы: Пн–Пт: 8:00–17:00
            </li>
          </ul>
        </section>
        <section>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/90 xl:text-base">
            Полезные ссылки
          </h3>
          <ul className="flex flex-col gap-2.5">
            <li><button type="button" className={linkClass} onClick={() => onTabChange?.('menu')}>Меню</button></li>
            <li><button type="button" className={linkClass} onClick={() => onTabChange?.('about')}>О нас</button></li>
            <li><button type="button" className={linkClass} onClick={() => onTabChange?.('contacts')}>Контакты</button></li>
          </ul>
        </section>
      </div>
      <div className="border-t border-white/10 py-4">
        <p className="text-center text-xs text-white/50 xl:text-sm">
          © 2026 Столовая Минского центра УВД. Все права защищены.
        </p>
      </div>
    </footer>
  )
}
